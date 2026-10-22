/**
 * Behavioural checks for the pagination window + "Showing x–y of z" math the
 * listing hook and footer rely on (pure logic, no React needed).
 * Run: npx tsx hooks/__tests__/useListQuery.pageWindow.test.ts
 */
let failures = 0;
const expectEqual = (label: string, actual: unknown, expected: unknown) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.error(`FAIL ${label}\n  actual:   ${JSON.stringify(actual)}\n  expected: ${JSON.stringify(expected)}`);
  } else {
    console.log(`ok   ${label}`);
  }
};

// Mirrors usePageWindow's memo body — keep in sync or extract to a pure helper later.
function pageWindowLogic(current: number, last: number): Array<number | "gap-lead" | "gap-tail"> {
  if (last <= 7) {
    const pages: number[] = [];
    for (let i = 1; i <= last; i++) pages.push(i);
    return pages;
  }
  const pages: Array<number | "gap-lead" | "gap-tail"> = [1];
  const start = Math.max(2, current - 2);
  const end = Math.min(last - 1, current + 2);
  if (start > 2) pages.push("gap-lead");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < last - 1) pages.push("gap-tail");
  pages.push(last);
  return pages;
}

expectEqual("small: 5 pages", pageWindowLogic(1, 5), [1, 2, 3, 4, 5]);
expectEqual("edge: exactly 7", pageWindowLogic(4, 7), [1, 2, 3, 4, 5, 6, 7]);
expectEqual("8 pages, first", pageWindowLogic(1, 8), [1, 2, 3, "gap-tail", 8]);
expectEqual("8 pages, middle", pageWindowLogic(4, 8), [1, 2, 3, 4, 5, 6, "gap-tail", 8]);
expectEqual("30 pages, middle", pageWindowLogic(15, 30), [1, "gap-lead", 13, 14, 15, 16, 17, "gap-tail", 30]);
expectEqual("30 pages, near end", pageWindowLogic(29, 30), [1, "gap-lead", 27, 28, 29, 30]);

// Showing x–y math as PaginationFooter renders it
const showing = (total: number, currentPage: number, perPage: number) => {
  if (total <= 0) return "No results";
  const first = (currentPage - 1) * perPage + 1;
  const last = Math.min(currentPage * perPage, total);
  return `Showing ${first}–${last} of ${total}`;
};
expectEqual("showing p1", showing(42, 1, 15), "Showing 1–15 of 42");
expectEqual("showing p3 tail", showing(42, 3, 15), "Showing 31–42 of 42");
expectEqual("showing empty", showing(0, 1, 15), "No results");

if (failures > 0) {
  process.exit(1);
}
console.log("\nAll page-window checks passed");