<script lang="ts">
  import {
    fetchDailyData,
    fetchWeeklyData,
    fetchMonthlyData,
    fetchLongestData,
    fetchLastData,
    fetchLastPing,
  } from "$lib/ts/api";

  import { onMount, onDestroy } from "svelte";
  import { formatDistanceToNow, formatDuration, intervalToDuration } from "date-fns";

  let dailyCount = 0;
  let weeklyCount = 0;
  let monthlyCount = 0;

  let longestDuration = 0;
  let longestDurationFormatted = "";

  let lastOutageAgo = "";
  let lastOutageDurationFormatted = "";
  let lastOutageTimestamp: Date | null = null;

  let weeklyLongestFormatted = "";
  let monthlyLongestFormatted = "";

  let lastPingTimestamp: Date | null = null;
  let lastPingInSeconds = "";

  let mainInterval: number;
  let pingInterval: number;

  function formatSeconds(secs: number): string {
    const duration = intervalToDuration({ start: 0, end: secs * 1000 });
    const formatted = formatDuration(duration, { delimiter: ", " });

    if (secs === 0) return "0 seconds";
    return formatted || `${Math.round(secs)} second${Math.round(secs) > 1 ? "s" : ""}`;
  }

  function formatSecondsAgo(timestamp: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  async function updateAllData() {
    try {
      const [daily, weekly, monthly, longest, last, lastPing] = await Promise.all([
        fetchDailyData(),
        fetchWeeklyData(),
        fetchMonthlyData(),
        fetchLongestData(),
        fetchLastData(),
        fetchLastPing(),
      ]);

      dailyCount = daily.length;
      weeklyCount = weekly.length;
      monthlyCount = monthly.length;

      longestDuration = longest?.duration || 0;
      longestDurationFormatted = formatSeconds(longestDuration);

      const weeklyDurations = weekly.length > 0 ? weekly.map(d => d.duration) : [0];
      weeklyLongestFormatted = formatSeconds(Math.max(...weeklyDurations));

      const monthlyDurations = monthly.length > 0 ? monthly.map(d => d.duration) : [0];
      monthlyLongestFormatted = formatSeconds(Math.max(...monthlyDurations));

      if (last) {
        lastOutageTimestamp = new Date(last.timestamp * 1000);
        lastOutageAgo = formatDistanceToNow(lastOutageTimestamp, { addSuffix: true });
        lastOutageDurationFormatted = formatSeconds(last.duration);
      }

      if (lastPing?.timestamp) {
        lastPingTimestamp = new Date(lastPing.timestamp * 1000);
        lastPingInSeconds = formatSecondsAgo(lastPingTimestamp);
      }
    } catch (err) {
      console.error("Failed to load powercut data:", err);
    }
  }

  function updateTimestamps() {
    if (lastOutageTimestamp) {
      lastOutageAgo = formatDistanceToNow(lastOutageTimestamp, { addSuffix: true });
    }
    if (lastPingTimestamp) {
      lastPingInSeconds = formatSecondsAgo(lastPingTimestamp);
    }
  }

  onMount(async () => {
    await updateAllData();
    mainInterval = setInterval(updateAllData, 30000);
    pingInterval = setInterval(updateTimestamps, 1000);
  });

  onDestroy(() => {
    clearInterval(mainInterval);
    clearInterval(pingInterval);
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
      Last ping <b class="text-red-500">{lastPingInSeconds}</b>
    </div>
  </div>
</div>