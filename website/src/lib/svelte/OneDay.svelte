<script lang="ts">
  import { onMount } from "svelte";
  import { fetchDailyData } from "$lib/ts/api";

  let END_TIME = Math.floor(Date.now() / 1000);
  let START_TIME = END_TIME - 24 * 60 * 60;

  let downtimes: { timestamp: number; duration: number }[] = [];

  $: bar_details = [];
  $: {
    END_TIME = Math.floor(Date.now() / 1000);
    START_TIME = END_TIME - 24 * 60 * 60;
    
    bar_details = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = END_TIME - (i + 1) * 60 * 60;
      const hourEnd = END_TIME - i * 60 * 60;

      const overlaps = downtimes.filter(down => {
        const downStart = down.timestamp;
        const downEnd = down.timestamp + down.duration;
        return downStart < hourEnd && downEnd > hourStart;
      });

      if (overlaps.length > 0) {
        bar_details.push({
          status: "down",
          downtimes: overlaps,
          hourStart
        });
      } else {
        bar_details.push({
          status: "up",
          hourStart
        });
      }
    }
    bar_details.reverse();
  }

  function formatIST(unix: number): string {
    const date = new Date(unix * 1000);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  function formatSeconds(secs: number): string {
    if (secs === 0) return "0 seconds";
    if (secs < 60) return `${Math.round(secs)} second${Math.round(secs) > 1 ? "s" : ""}`;
    
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours > 1 ? "s" : ""}`);
    if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`);
    
    return parts.join(", ");
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
        <div><strong>${formatIST(data.hourStart)}</strong></div>
        ${data.downtimes.map(d => `🔴 ${formatIST(d.timestamp)} for ${formatSeconds(d.duration)}`).join("<br>")}
      `;
    } else {
      tooltipContent = `<div><strong>${formatIST(data.hourStart)}</strong></div>`;
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
      console.error("Failed to load daily data:", err);
      downtimes = [];
    }
  });
</script>


<div class="mt-10 flex gap-1 sm:gap-2 px-1 sm:px-6 h-[12vh]">
  {#each bar_details as data, i}
    <div
      class="{data.status === 'down' ? 'bg-red-500' : 'bg-green-500'} flex-1 rounded-lg relative"
      style="min-width: 0"
      on:mouseenter={(e) => handleMouseEnter(e, data)}
      on:mouseleave={handleMouseLeave}
      tabindex="{i}"
    ></div>
  {/each}
</div>

<p class="mx-4 text-sm mt-2 text-gray-300">24h</p>


{#if showTooltip}
  <div
    class="fixed z-50 bg-black text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-full whitespace-nowrap pointer-events-none"
    style="top: {tooltipY}px; left: {tooltipX}px; transform: translate(-50%, -100%)"
  >
    {@html tooltipContent}
  </div>
{/if}