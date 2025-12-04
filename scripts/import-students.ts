// scripts/import-students.ts
const API_BASE_URL = "https://studentroster.onrender.com";

type RawStudent = {
  name: string;
  id: string;
  phone: string;
  birthday: string;
};

type StudentPayload = {
  name: string;
  studentId: string;
  phone: string;
  birthday: string;
};

const rawStudents: RawStudent[] = [
  {
    name: "นายศิวกร คงสมบัติ",
    id: "36677",
    phone: "961352533",
    birthday: "4/9/2551",
  },
  {
    name: "นายฐิติพงศ์ วรศักดาพิศาล",
    id: "36714",
    phone: "952518428",
    birthday: "16/2/2552",
  },
  {
    name: "นายธนายุทธ โถนะวัลย์",
    id: "36716",
    phone: "642240051",
    birthday: "26/4/2552",
  },
  {
    name: "นายปพณธีร์ วิริยะกุล",
    id: "36719",
    phone: "969981826",
    birthday: "9/6/2552",
  },
  {
    name: "นายพศวัตอัฑฒ์ วสุพลพัสกร",
    id: "36721",
    phone: "846616141",
    birthday: "15/6/2552",
  },
  {
    name: "นายธราดล แก้วพะเนียง",
    id: "36762",
    phone: "870689066",
    birthday: "2/12/2551",
  },
  {
    name: "นายนิพิพนธ์ คล้อยชาวนา",
    id: "36764",
    phone: "634734372",
    birthday: "27/6/2551",
  },
  {
    name: "นางสาวขวัญแก้ว สุขสังวาลย์",
    id: "36779",
    phone: "928197785",
    birthday: "3/11/2551",
  },
  {
    name: "นางสาวเขมณัฐอร ชูขำ",
    id: "36780",
    phone: "958548563",
    birthday: "1/7/2552",
  },
  {
    name: "นางสาวเบญจมาศ โพธิ์สาวัง",
    id: "36787",
    phone: "981093121",
    birthday: "10/5/2552",
  },
  {
    name: "นายธนากร วาจาดี",
    id: "36807",
    phone: "803173005",
    birthday: "30/11/2551",
  },
  {
    name: "นางสาวพรชนก หงส์กลาย",
    id: "36832",
    phone: "922956450",
    birthday: "16/10/2551",
  },
  {
    name: "นางสาวพรรษา ธรรมปัญญา",
    id: "36834",
    phone: "993702581",
    birthday: "8/7/2552",
  },
  {
    name: "นายธนพัฒน์ รักคุณ",
    id: "36846",
    phone: "954386828",
    birthday: "2/1/2552",
  },
  {
    name: "นางสาวชนัญญา สถิตย์เวียงทอง",
    id: "36868",
    phone: "905144614",
    birthday: "18/7/2551",
  },
  {
    name: "นายธนกร อาษานอก",
    id: "36893",
    phone: "815451645",
    birthday: "27/7/2552",
  },
  {
    name: "นางสาวณพิชญา อุ่นเอม",
    id: "36912",
    phone: "970970192",
    birthday: "15/10/2552",
  },
  {
    name: "นางสาวพิชามญธ์ุ พีระพันธ์",
    id: "36962",
    phone: "805959467",
    birthday: "30/6/2552",
  },
  {
    name: "นางสาววรัมพร รัตติกาลชลากร",
    id: "36966",
    phone: "924392452",
    birthday: "11/3/2552",
  },
  {
    name: "นายน่านศิริ ศิริรัตนาจารย์",
    id: "37015",
    phone: "639343673",
    birthday: "21/1/2552",
  },
  {
    name: "นายสรวิชญ์ เสริมพล",
    id: "37088",
    phone: "821974132",
    birthday: "--/--/2551",
  },
  {
    name: "นางสาวเขมินทรา จอมมาลัย",
    id: "37093",
    phone: "959505924",
    birthday: "10/2/2552",
  },
  {
    name: "นางสาวบงกชกนก กุฎๅษี",
    id: "37099",
    phone: "979874415",
    birthday: "16/6/2551",
  },
  {
    name: "นายณัฐนันท์ หอมบุบผา",
    id: "39341",
    phone: "839484485",
    birthday: "26/9/2551",
  },
  {
    name: "นายณัฐพัฒน์ พิณศรี",
    id: "39342",
    phone: "968812259",
    birthday: "29/9/2551",
  },
  {
    name: "นายธนากร ทองไกร",
    id: "39343",
    phone: "931082728",
    birthday: "22/9/2551",
  },
  {
    name: "นายธวัลรัตน์ เทพยุหะ",
    id: "39344",
    phone: "-",
    birthday: "--/--/----",
  },
  {
    name: "นายศุภณัฐ ฉิมมา",
    id: "39345",
    phone: "828624340",
    birthday: "3/7/2551",
  },
  {
    name: "นางสาวชุติกาญจน์ มุทุตานนท์",
    id: "39346",
    phone: "982525692",
    birthday: "10/1/2552",
  },
  {
    name: "นายธีธัชภ์ มรรคาเขต",
    id: "39347",
    phone: "959513713",
    birthday: "4/9/2552",
  },
  {
    name: "นางสาวขวัญชนก มะสีโย",
    id: "39348",
    phone: "827836453",
    birthday: "27/5/2552",
  },
];

async function main() {
  console.log(`Importing ${rawStudents.length} students to ${API_BASE_URL} ...`);

  for (const s of rawStudents) {
    const payload: StudentPayload = {
      name: s.name,
      studentId: s.id,                 // map id -> studentId
      phone: s.phone === "-" ? "" : s.phone,
      birthday: s.birthday,
    };

    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`❌ ${s.name} (${s.id}) failed:`, res.status, text);
    } else {
      const created = await res.json();
      console.log(`✅ ${created.studentId} — internal id: ${created.id}`);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Import error:", err);
  process.exit(1);
});