// 测试GitHubStyleCalendar的月份colspan计算逻辑

// 模拟日历天数生成
function generateCalendarDays(year) {
  const days = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  // 计算第一周的起始日期（调整到周一）
  const firstDayOfYear = new Date(year, 0, 1);
  const startOfCalendar = new Date(firstDayOfYear);
  startOfCalendar.setDate(
    firstDayOfYear.getDate() -
      firstDayOfYear.getDay() +
      (firstDayOfYear.getDay() === 0 ? -6 : 1)
  );

  // 计算结束日期：当前年份的12月31日 + 足够的天数来完成最后一周
  const endOfCalendar = new Date(endDate);
  endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));

  let currentDay = new Date(startOfCalendar);

  while (currentDay <= endOfCalendar) {
    // 获取月份（0-11）和周几（0-6，0是周日）
    const month = currentDay.getMonth();
    // 将周几转换为周一到周日（0-6，0是周一）
    let dayOfWeek = currentDay.getDay();
    dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    days.push({
      date: currentDay.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10), // 随机生成贡献数
      isCurrentYear: currentDay.getFullYear() === year,
      month: month,
      dayOfWeek: dayOfWeek,
      actualDate: new Date(currentDay),
    });

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return days;
}

// 模拟月份单元格计算
function calculateMonthCells(year) {
  const allDays = generateCalendarDays(year);
  const totalWeeks = Math.ceil(allDays.length / 7);

  console.log(`年份: ${year}`);
  console.log(`总天数: ${allDays.length}`);
  console.log(`总周数: ${totalWeeks}`);
  console.log("\n====================\n");

  // 1. 统计每个周中各个月份的日期数量
  const weekMonthCounts = Array.from({ length: totalWeeks }, () => new Map());

  allDays.forEach((day, index) => {
    if (day.isCurrentYear) {
      const weekIndex = Math.floor(index / 7);
      const monthCount = weekMonthCounts[weekIndex].get(day.month) || 0;
      weekMonthCounts[weekIndex].set(day.month, monthCount + 1);
    }
  });

  // 2. 为每个周分配归属月份（日期数量最多的月份，相同数量则选择上一个月）
  const weekOwnership = new Array(totalWeeks).fill(-1);

  weekMonthCounts.forEach((monthCounts, weekIndex) => {
    let maxCount = 0;
    let owningMonth = -1;

    // 检查是否有月份在该周有日期
    if (monthCounts.size > 0) {
      // 遍历所有月份，找出日期数量最多的月份
      for (let month = 0; month < 12; month++) {
        const count = monthCounts.get(month) || 0;
        if (count > maxCount || (count === maxCount && owningMonth === -1)) {
          maxCount = count;
          owningMonth = month;
        }
      }
    }

    weekOwnership[weekIndex] = owningMonth;
  });

  // 3. 计算每个月的colspan值
  const monthColspan = new Array(12).fill(0);

  weekOwnership.forEach((owningMonth) => {
    if (owningMonth !== -1) {
      monthColspan[owningMonth]++;
    }
  });

  // 打印每个周的归属月份和日期分布
  console.log("每周的归属月份和日期分布:");
  console.log("周索引 | 归属月份 | 日期分布");
  console.log("-------|----------|---------");

  weekOwnership.forEach((owningMonth, weekIndex) => {
    const monthCounts = weekMonthCounts[weekIndex];
    let dateDistribution = [];

    for (let month = 0; month < 12; month++) {
      const count = monthCounts.get(month) || 0;
      if (count > 0) {
        dateDistribution.push(`${getMonthName(month)}: ${count}`);
      }
    }

    console.log(
      `${weekIndex + 1} | ${
        owningMonth !== -1 ? getMonthName(owningMonth) : "无"
      } | ${dateDistribution.join(", ")}`
    );
  });

  console.log("\n====================\n");

  // 打印每个月的colspan值
  console.log("每个月的colspan值:");
  console.log("月份 | colspan");
  console.log("-----|--------");

  for (let month = 0; month < 12; month++) {
    console.log(`${getMonthName(month)} | ${monthColspan[month]}`);
  }

  // 计算总colspan
  const totalColspan = monthColspan.reduce((sum, value) => sum + value, 0);
  console.log(`\n总colspan: ${totalColspan}`);
  console.log(`总周数: ${totalWeeks}`);
  console.log(`是否相等: ${totalColspan === totalWeeks ? "是" : "否"}`);

  // 生成月份单元格数据
  const months = [];
  for (let month = 0; month < 12; month++) {
    months.push({
      month: getMonthName(month),
      days: monthColspan[month],
    });
  }

  return months;
}

// 获取月份名称
function getMonthName(monthIndex) {
  return new Date(0, monthIndex).toLocaleDateString("en-US", {
    month: "short",
  });
}

// 测试特定月份的周分布（例如2025年3月）
function testSpecificMonth(year, targetMonth) {
  const allDays = generateCalendarDays(year);
  const monthDays = allDays.filter(
    (day) => day.month === targetMonth && day.isCurrentYear
  );

  console.log(`\n====================\n`);
  console.log(`${getMonthName(targetMonth)}的所有日期:`);
  console.log(`日期 | 周索引`);
  console.log(`-----|--------`);

  monthDays.forEach((day) => {
    const index = allDays.indexOf(day);
    const weekIndex = Math.floor(index / 7);
    console.log(`${day.date} | 周${weekIndex + 1}`);
  });
}

// 运行测试
const year = 2025;
console.log("GitHubStyleCalendar 月份colspan计算逻辑测试");
console.log("======================================");
calculateMonthCells(year);

// 测试特定月份
testSpecificMonth(year, 2); // 3月 (0-indexed)
