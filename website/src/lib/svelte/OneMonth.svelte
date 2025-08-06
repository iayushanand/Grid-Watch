<script lang="ts">
  import { onMount } from "svelte";
  import { fetchMonthlyData } from "$lib/ts/api";
  import { formatDuration, intervalToDuration } from "date-fns";

  const SECONDS_IN_DAY = 86400;

  let END_TIME = Math.floor(Date.now() / 1000);
  let START_TIME = END_TIME - 30 * SECONDS_IN_DAY;

  let downtimes: { timestamp: number; duration: number }[] = [];

  $: bar_details = [];
  $: {
    END_TIME = Math.floor(Date.now() / 1000);
    START_TIME = END_TIME - 30 * SECONDS_IN_DAY;
    
    bar_details = [];
    for (let i = 0; i < 30; i++) {
      const dayStart = END_TIME - (i + 1) * SECONDS_IN_DAY;
      const dayEnd = END_TIME - i * SECONDS_IN_DAY;

      const overlaps = downtimes.filter(down => {
        const downStart = down.timestamp;
        const downEnd = down.timestamp + down.duration;
        return downStart < dayEnd && downEnd > dayStart;
      });

      if (overlaps.length > 0) {
        bar_details.push({
          status: "down",
          downtimes: overlaps,
          dayStart
        });
      } else {
        bar_details.push({
          status: "up",
          dayStart
        });
      }
    }
    bar_details.reverse();
  }

  function formatIST(unix: number): string {
    const date = new Date(unix * 1000);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  function formatHead(unix: number): string {
    const date = new Date(unix * 1000);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: 'short',
      day: 'numeric'
    });
  }
  

  function formatSeconds(secs: number): string {
    if (secs === 0) return "0 seconds";
    if (secs < 60) return `${Math.round(secs)} second${Math.round(secs) > 1 ? "s" : ""}`;
    
    const duration = intervalToDuration({ start: 0, end: secs * 1000 });
    const formatted = formatDuration(duration, { delimiter: ", " });
    
    return formatted || "Unknown duration";
  }

  let tooltipContent = "";
  let tooltipX = 0;
  let tooltipY = 0;
  let showTooltip = false;

  function handleMouseEnter(e: MouseEvent, data: any) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const tooltipWidth = 200;
    const padding = 8;

    let x = rect.left + rect.width / 2;
    const y = rect.top - 10;

    const screenWidth = window.innerWidth;

    if (x - tooltipWidth / 2 < padding) {
      x = tooltipWidth / 2 + padding;
    } else if (x + tooltipWidth / 2 > screenWidth - padding) {
      x = screenWidth - tooltipWidth / 2 - padding;
    }

    tooltipX = x;
    tooltipY = y;

    if (data.status === "down") {
      tooltipContent = `
        <div><strong>${formatHead(data.dayStart)}</strong></div>
        ${data.downtimes.map(d => `🔴 ${formatIST(d.timestamp)} for ${formatSeconds(d.duration)}`).join("<br>")}
      `;
    } else {
      tooltipContent = `<div><strong>No outages on ${formatHead(data.dayStart)}</strong></div>`;
    }

    showTooltip = true;
  }

  function handleMouseLeave() {
    showTooltip = false;
  }

  onMount(async () => {
    try {
      setInterval(
        async () => {
        downtimes = await fetchDailyData();
        },
        30000
      )
    } catch (err) {
      console.error("Failed to load monthly data:", err);
      downtimes = [];
    }
  });
</script>

<div class="mt-10 flex gap-1 sm:gap-1 px-1 sm:px-6 h-[12vh]">
  {#each bar_details as data, i}
    <div
      class="{data.status === 'down' ? 'bg-red-500' : 'bg-green-500'} flex-1 rounded-sm relative"
      style="min-width: 0"
      on:mouseenter={(e) => handleMouseEnter(e, data)}
      on:mouseleave={handleMouseLeave}
      tabindex="{i}"
    ></div>
  {/each}
</div>

<p class="mx-4 text-sm mt-2 text-gray-300">30d</p>

{#if showTooltip}
  <div
    class="fixed z-50 bg-black text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-full whitespace-nowrap pointer-events-none"
    style="top: {tooltipY}px; left: {tooltipX}px; transform: translate(-50%, -100%)"
  >
    {@html tooltipContent}
  </div>
{/if}