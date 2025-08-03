<script lang="ts">
  import {
    fetchDailyData,
    fetchWeeklyData,
    fetchMonthlyData,
    fetchLongestData,
    fetchLastData,
    fetchLastPing,
  } from "$lib/ts/api";

  import { onMount } from "svelte";
  import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";

  let dailyCount = 0;
  let weeklyCount = 0;
  let monthlyCount = 0;

  let longestDuration = 0;
  let longestDurationFormatted = "";

  let lastOutageAgo = "";
  let lastOutageDurationFormatted = "";

  let weeklyLongestFormatted = "";
  let monthlyLongestFormatted = "";

  let lastPingAgo = "";

  function formatMinutes(mins: number): string {
    if (mins < 1) return "<1 minute";
    if (mins < 60) return `${Math.round(mins)} minute${mins > 1 ? "s" : ""}`;
    const dur = intervalToDuration({ start: 0, end: mins * 60 * 1000 });
    return formatDuration(dur);
  }

  onMount(async () => {
    try {
      const [daily, weekly, monthly, longest, last, lastPing] = await Promise.all([
        fetchDailyData(),
        fetchWeeklyData(),
        fetchMonthlyData(),
        fetchLongestData(),
        fetchLastData(),
        fetchLastPing()
      ]);

      dailyCount = daily.length;
      weeklyCount = weekly.length;
      monthlyCount = monthly.length;

      longestDuration = longest?.duration || 0;
      longestDurationFormatted = formatMinutes(longestDuration);

      weeklyLongestFormatted = formatMinutes(Math.max(...weekly.map(d => d.duration)));
      monthlyLongestFormatted = formatMinutes(Math.max(...monthly.map(d => d.duration)));

      if (last) {
        const lastTime = new Date(last.timestamp);
        lastOutageAgo = formatDistanceToNow(lastTime, { addSuffix: true });
        lastOutageDurationFormatted = formatMinutes(last.duration);
      }

      if (lastPing?.timestamp) {
        lastPingAgo = formatDistanceToNow(new Date(lastPing.timestamp), { addSuffix: true });
      }

    } catch (err) {
      console.error("Failed to load powercut data:", err);
    }
  });
</script>

<div class="mx-4 sm:mx-10 my-10 border border-white/5 py-3 px-4 sm:px-8 bg-gray-800/30 rounded-2xl">
  <div class="max-w-screen-xl mx-auto items-center justify-between px-4 py-3">
    <div class="flex items-center justify-center text-center w-full space-x-3 mb-10">
      <span class="text-white text-lg font-semibold tracking-wide">Powercut Details</span>
    </div>

    <div class="text-center">
      In past <b class="text-red-500">24 hours</b> there have been
      <b class="text-red-500">{dailyCount}</b> outage(s),
      and the longest outage recorded was <b class="text-red-500">{longestDurationFormatted}</b>.
      Last outage was <b class="text-red-500">{lastOutageAgo}</b> that lasted
      <b class="text-red-500">{lastOutageDurationFormatted}</b>.
    </div>

    <br />

    <div class="text-center">
      In past <b class="text-red-500">7 days</b> there have been
      <b class="text-red-500">{weeklyCount}</b> outage(s),
      and the longest outage recorded was <b class="text-red-500">{weeklyLongestFormatted}</b>.
    </div>

    <br />

    <div class="text-center">
      In past <b class="text-red-500">30 days</b> there have been
      <b class="text-red-500">{monthlyCount}</b> outage(s),
      and the longest outage recorded was <b class="text-red-500">{monthlyLongestFormatted}</b>.
    </div>

    <br />

    <div class="text-center">
      Last ping <b class="text-red-500">{lastPingAgo}</b>
    </div>
  </div>
</div>
