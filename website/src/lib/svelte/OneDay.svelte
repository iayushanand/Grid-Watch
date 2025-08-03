<script>
    import { onMount } from "svelte";

    const END_TIME = Math.floor(Date.now() / 1000);
    const START_TIME = END_TIME - 24 * 60 * 60;

    const downtimes = [
    { timestamp: END_TIME - 14567, duration: 760 },
    { timestamp: END_TIME - 19234, duration: 1086 },
    { timestamp: END_TIME - 24567, duration: 512 },
    { timestamp: END_TIME - 31234, duration: 903 },
    { timestamp: END_TIME - 38670, duration: 600 },
    { timestamp: END_TIME - 44210, duration: 990 },
    { timestamp: END_TIME - 48765, duration: 756 },
    { timestamp: END_TIME - 53890, duration: 849 },
    { timestamp: END_TIME - 58932, duration: 777 },
    { timestamp: END_TIME - 63450, duration: 1012 },
    { timestamp: END_TIME - 74456, duration: 843 }
    ];


    function formatIST(unix) {
        return new Date(unix * 1000).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true
        });
    }

    const bar_details = [];


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
                <div><strong>${formatIST(data.hourStart)}</strong></div>
                ${data.downtimes.map(d => `🔴 ${formatIST(d.timestamp)} for ${Math.floor(d.duration / 60)} min`).join("<br>")}
            `;
        } else {
            tooltipContent = `<div><strong>${formatIST(data.hourStart)}</strong></div>`;
        }

        showTooltip = true;
    }


    function handleMouseLeave() {
        showTooltip = false;
    }
</script>


    <div class="mt-10 flex gap-1 sm:gap-2 px-1 sm:px-6 h-[12vh]">
        {#each bar_details as data, i}
            <div
                class="{data.status === 'down' ? 'bg-red-500' : 'bg-green-500'} flex-1 rounded-lg relative"
                style="min-width: 0"
                onmouseenter={(e) => handleMouseEnter(e, data)}
                onmouseleave={handleMouseLeave}
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

