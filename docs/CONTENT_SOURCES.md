# Content provenance and refresh

The adapted country database in `src/lib/data/world.json` is distributed under ODbL 1.0. The full upstream license is in `src/lib/data/LICENSE.countries.txt`; this database license does not replace the application code license.

- Upstream: https://github.com/mledoze/countries
- Pinned revision: `c2ac0049c14edcf2436c7aa1b2493222a020b462`
- Imported: 2026-10-19; `world-2026-10-v1`
- Transformation: `scripts/import-countries.mjs`, selecting 194 independent entries plus Palestine. Upstream membership flags are not used to claim UN membership.
- Country centers are approximate country coordinates, not capital coordinates. Borders exclude unresolved/non-covered entities from correct choices, and exclude every covered valid neighbor from distractors. Borders reflect the source snapshot.
- Sri Lanka correction: [Kotte Municipal Council](https://www.kotte.mc.gov.lk/index.php?Itemid=175&id=25&lang=en&option=com_content&view=article); prompt specifies legislative capital.
- Zimbabwe correction: [Reserve Bank statement](https://www.rbz.co.zw/index.php/publications-notices/notices/press-release/1419-press-statement-introduction-of-zimbabwe-gold-zig-currency-code-zwg), using ZWG and USD rather than obsolete bond currency entries.
- Missing Micronesia currency supplied as USD: [US Department of the Interior](https://www.doi.gov/oia/islands/fsm).
- Original local landmarks and portraits are retained; no new image collection was downloaded. Review image rights before redistributing those existing assets outside this project.
- Flags: small FlagCDN images requested only for the active question. Map tiles load only when opening Map Pin. The home page uses local SVG/CSS and system fonts.
- Stats War retains the original approximate, undated population/area snapshot; prompts now say total area rather than land area. It is not a current statistical reference.

## Refresh workflow

1. Choose and record an upstream commit; download that revision’s `countries.json` and license. Do not fetch a moving branch during builds.
2. Run `node scripts/import-countries.mjs <path-to-countries.json>` from the project root. The original raw download can stay in ignored `private/`.
3. Review political/geographic edge cases, capital changes, currencies, languages, and every local correction. This source can have stale or incomplete fields.
4. Increment `CONTENT_VERSION`, update provenance, and run the release checks. Coordinate daily challenge changes with UTC midnight if keeping a day stable is important.

The adapted database and transformation are public source files. The user-facing `/content-sources` page provides attribution and explains limitations.
