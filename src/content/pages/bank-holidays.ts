import { definePage } from '../../lib/guide-types';
import BANK from '../../data/bank-holidays.json';

const NAME: Record<string, string> = { 'england-and-wales': 'England and Wales', scotland: 'Scotland', 'northern-ireland': 'Northern Ireland' };
export default definePage({
  id: 'bank-holidays',
  group: 'rules',
  order: 120,
  mini: 'bank',
  related: ['christmas-holidays', 'easter-holidays', 'may-half-term', 'term-dates-scotland', 'school-holidays-2027'],
  sources: ['bank_holidays', 'ni_holidays', 'govuk_find_council'],
  slug: 'bank-holidays',
  nav: 'Bank holidays and schools',
  card: 'Every bank holiday to 2028 and whether schools close',
  title: 'Bank Holidays 2026 to 2028: UK Dates and School Closures',
  description: 'Bank holidays 2026, 2027 and 2028 in England and Wales, Scotland and Northern Ireland from GOV.UK, with the ones that close schools in term time marked.',
  h1: 'Bank holidays 2026 to 2028, and what they mean for school',
  intro: 'Most bank holidays land in a school break; two or three a year close schools in the middle of a term.',
  resume: (h) => `England and Wales have eight bank holidays a year, Scotland nine and Northern Ireland ten, and the dates for 2026, 2027 and 2028 are published by GOV.UK. For schools in England and Wales, only some of them matter: Christmas, New Year, Good Friday and Easter Monday normally fall inside a school holiday, the spring bank holiday starts May half term and the August bank holiday falls in the summer break. That leaves the early May bank holiday, Monday 3 May 2027, as the one that usually closes schools in the middle of a term. In Scotland the picture is different: councils set their own public and local holidays, which do not always match the Scottish bank holidays, so St Andrew's Day or Easter Monday can be a school day. In Northern Ireland, St Patrick's Day, 17 March, is a common school closure. The tool below gives the next bank holidays where you live.`,
  faqs: () => [
    { q: 'Are schools closed on bank holidays?', a: 'In England, Wales and Northern Ireland, state schools do not open on a bank holiday. In Scotland schools follow the holiday list each council publishes, which includes some bank holidays and some local days, so a Scottish school can be open on a Scottish bank holiday.' },
    { q: 'What is the next bank holiday in term time?', a: 'In England and Wales in 2026-27, the early May bank holiday on Monday 3 May 2027. The Christmas, New Year and Easter bank holidays fall in the school holidays, the spring bank holiday on 31 May opens May half term and the summer bank holiday on 30 August 2027 is in the summer break.' },
    { q: 'What happens when a bank holiday falls on a weekend?', a: 'A substitute weekday is given, usually the following Monday. Boxing Day 2026 falls on a Saturday, so Monday 28 December 2026 is the bank holiday. Christmas Day 2027 is also a Saturday: the bank holidays are Monday 27 and Tuesday 28 December, and New Year 2028 moves to Monday 3 January.' },
    { q: 'Is St Andrew’s Day a school holiday in Scotland?', a: 'St Andrew’s Day, Monday 30 November 2026, is a Scottish bank holiday, but whether schools close depends on the council. Check the Scottish council pages on this site, which list the local holidays each council has set.' },
  ],
  body: (h) => {
    const rows = Object.entries(BANK.divisions).flatMap(([k, ev]) => ev.filter((e) => e.date >= '2026-10-01').map((e) => [NAME[k], e.title, h.date(e.date)]));
    return `
<h2>Every bank holiday from October 2026 to 2028</h2>
<p>The list comes from the official GOV.UK bank holiday data, read on ${h.date(BANK.retrieved)}, which the government publishes under the Open Government Licence. Dates further ahead can still be changed by royal proclamation, as happened in 2022 and 2023.</p>
${h.table(['Nation', 'Bank holiday', 'Date'], rows, 'Source: GOV.UK bank holidays feed.', ['l', 'l', 'l'])}
<h2>Which ones close schools in term time</h2>
<p>For a school calendar in England, Wales and Northern Ireland, a bank holiday is either inside a break, where it changes nothing, or inside a term, where it closes the school for the day. In 2026-27 the pattern is the usual one for an early Easter: Good Friday on 26 March and Easter Monday on 29 March 2027 open the Easter holidays, and the early May bank holiday on 3 May sits in the summer term. The checker on this site applies the GOV.UK list to every English, Welsh and Northern Irish council calendar automatically, so a bank holiday in term time always shows as "no school".</p>
<h2>Scotland: council holidays, not bank holidays</h2>
<p>Scottish bank holidays mainly govern banks and some public offices. Schools follow the holiday list of their council, which usually includes Good Friday and a May Day holiday, may or may not include Easter Monday, St Andrew's Day and the summer bank holiday in early August, and adds local holidays such as a September weekend Monday. That is why the checker uses only the council's own list for Scottish councils.</p>
<h2>Northern Ireland: two extra days</h2>
<p>Northern Ireland adds St Patrick's Day on 17 March and the Battle of the Boyne on 12 July. In 2027 St Patrick's Day is a Wednesday in term time, and it is on the list of common closure dates agreed by all school sectors. The Twelfth falls in the summer holiday, which starts on 1 July.</p>
<!--tool:countdown-->
<h2>Royal events and one-off holidays</h2>
<p>Extra bank holidays have been declared for coronations and jubilees. When that happens the GOV.UK list is updated and councils announce whether the extra day closes schools. We re-read the feed with each update of the site.</p>`;
  },
});
