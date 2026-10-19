import Link from 'next/link';
import { contentCounts } from '@/src/lib/quiz/questions';
import { categoryIds, categoryLabels } from '@/src/lib/quiz/config';
export const metadata = { title: 'Content and sources | GeoBrains' };
export default function ContentSources() {
    return <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-brand">← All challenges</Link>
        <h1 className="text-4xl font-black mt-7 mb-6">A world worth getting right</h1>
        <p className="text-text-secondary leading-relaxed mb-7">GeoBrains uses a bundled snapshot of 195 countries, with five broad world regions. The question bank is available without a live data service. Images and interactive map tiles still need a connection.</p>
        <h2 className="text-2xl font-bold mb-4">What you can explore</h2>
        <ul className="grid grid-cols-2 gap-3 mb-8">{categoryIds.filter(id => id !== 'mixed').map(id => <li key={id} className="glass-panel rounded-xl p-4">
            <span className="font-bold">{categoryLabels[id]}</span>
            <p className="text-sm text-text-secondary mt-1">{contentCounts[id]} questions</p>
        </li>)}</ul>
        <h2 className="text-2xl font-bold mb-3">Sources and attribution</h2>
        <p className="text-text-secondary leading-relaxed mb-4">Country records are adapted from <a className="text-brand underline" href="https://github.com/mledoze/countries/tree/c2ac0049c14edcf2436c7aa1b2493222a020b462">mledoze/countries</a>, under the <a className="text-brand underline" href="https://opendatacommons.org/licenses/odbl/1-0/">Open Database License 1.0</a>. Our adapted database, import script, license, and corrections are available in the <a className="text-brand underline" href="https://github.com/JustinReyes28/GeoBrains/tree/v.0.0.19/src/lib/data">project source</a>. Flags come from FlagCDN; map tiles are provided by OpenStreetMap contributors.</p>
        <h2 className="text-2xl font-bold mt-8 mb-3">A snapshot, with context</h2>
        <ul className="text-text-secondary space-y-3 list-disc pl-5">
            <li>Country coverage follows the dataset’s independent entries plus Palestine. This is a learning atlas, not a position on recognition or borders.</li>
            <li>Multiple listed languages, currencies, and capitals are accepted when building a question; other valid answers are excluded from its choices. Language lists can include national and regional languages.</li>
            <li>Sri Lanka uses a specific legislative-capital prompt. Nauru and Palestine are omitted from capital questions to avoid oversimplified answers.</li>
            <li>Historical figures are associated with a modern country for the purposes of this quiz. That association does not describe every citizenship or historical boundary.</li>
            <li>Map pin scores measure distance to an approximate country center, rather than whether a pin falls within its borders.</li>
            <li>Stats War retains approximate values from the original project. These are not live population statistics.</li>
            <li>Daily challenges use UTC and a versioned question bank. Major content releases may change that day’s challenge.</li>
        </ul>
    </main>;
}
