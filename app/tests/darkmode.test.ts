/**
 * Jest Tests
 * =====================
 *
 * @contributors: P_Kariuki007 [@bd-mutant7] <182138871+bd-mutant7@users.noreply.github.com>
 *
 * @license: MIT License
 *
 */
import { darkModeToggle, darkModeDetect } from "@components/common/darkmode/darkmode";

test("darkModeToggle", async () => {
	expect(darkModeToggle()).toBe(true || false);
});

test("darkModeDetect", async () => {
	expect(darkModeDetect()).toBe(true || false);
});
