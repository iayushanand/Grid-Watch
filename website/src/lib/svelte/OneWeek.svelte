<script>
    const SECONDS_IN_DAY = 86400;
    const END_TIME = Math.floor(Date.now() / 1000);
    const START_TIME = END_TIME - 7 * SECONDS_IN_DAY;

    const downtimes = [
        { timestamp: END_TIME - 145670, duration: 760 },
        { timestamp: END_TIME - 192340, duration: 1086 },
        { timestamp: END_TIME - 245670, duration: 512 },
        { timestamp: END_TIME - 312340, duration: 903 },
        { timestamp: END_TIME - 386700, duration: 600 },
        { timestamp: END_TIME - 442100, duration: 990 },
        { timestamp: END_TIME - 487650, duration: 756 },
        { timestamp: END_TIME - 538900, duration: 849 },
        { timestamp: END_TIME - 589320, duration: 777 },
        { timestamp: END_TIME - 634500, duration: 1012 },
        { timestamp: END_TIME - 744560, duration: 843 },
        { timestamp: END_TIME - 800000, duration: 600 },
        { timestamp: END_TIME - 850000, duration: 1200 },
        { timestamp: END_TIME - 900000, duration: 450 },
        { timestamp: END_TIME - 950000, duration: 300 }
    ];

    function formatIST(unix) {
        return new Date(unix * 1000).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true
        });
    }

    const bar_details = [];

    for (let i = 0; i < 7; i++) {
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

    let tooltipContent = "";
    let tooltipX = 0;
    let tooltipY = 0;
    let showTooltip = false;

    function handleMouseEnter(e, data) {
        const rect = e.target.getBoundingClientRect();
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
                <div><strong>${formatIST(data.dayStart)}</strong></div>
                ${data.downtimes.map(d => `🔴 ${formatIST(d.timestamp)} for ${Math.floor(d.duration / 60)} min`).join("<br>")}
            `;
        } else {
            tooltipContent = `<div><strong>${formatIST(data.dayStart)}</strong></div>`;
        }

        showTooltip = true;
    }

    function handleMouseLeave() {
        showTooltip = false;
    }
</script>

<!-- Display 7-day bar -->
<div class="mt-10 flex gap-[2px] sm:gap-2 px-1 sm:px-6 h-[12vh]">
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

<p class="mx-4 text-sm mt-2 text-gray-300">7d</p>

{#if showTooltip}
    <div
        class="fixed z-50 bg-black text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-full whitespace-nowrap pointer-events-none"
        style="top: {tooltipY}px; left: {tooltipX}px; transform: translate(-50%, -100%)"
    >
        {@html tooltipContent}
    </div>
{/if}
