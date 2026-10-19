import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/Book.js";

dotenv.config();

const books = [
  {
    title: "Let Us C",
    author: "Yashavant Kanetkar",
    edition: "19th Edition",
    category: "Computer Science",
    condition: "Good",
    description:
      "Classic C programming book used in most Indian engineering colleges. Some pencil marks in early chapters, otherwise clean and complete.",
    image: "https://picsum.photos/seed/letusc/400/550",
    available: true,
    ownerName: "Aarav Sharma",
    ownerDepartment: "CSE",
    ownerSemester: "3rd",
  },
  {
    title: "Higher Engineering Mathematics",
    author: "B.S. Grewal",
    edition: "44th Edition",
    category: "Mathematics",
    condition: "Like New",
    description:
      "Barely used. Bought for first-year engineering maths. No highlighting, cover intact. Perfect for GATE prep too.",
    image: "https://picsum.photos/seed/grewal/400/550",
    available: true,
    ownerName: "Priya Patel",
    ownerDepartment: "ECE",
    ownerSemester: "2nd",
  },
  {
    title: "Concepts of Physics (Vol 1)",
    author: "H.C. Verma",
    edition: "Latest Edition",
    category: "Physics",
    condition: "Good",
    description:
      "Standard JEE/engineering physics book. Solved examples are clean; a few page corners folded. Vol 1 only.",
    image: "https://picsum.photos/seed/hcverma/400/550",
    available: true,
    ownerName: "Rohan Gupta",
    ownerDepartment: "ME",
    ownerSemester: "1st",
  },
  {
    title: "Indian Polity",
    author: "M. Laxmikanth",
    edition: "6th Edition",
    category: "Humanities",
    condition: "Like New",
    description:
      "Essential for UPSC and college civics courses. Almost new, only used for one semester of political science.",
    image: "https://picsum.photos/seed/laxmikanth/400/550",
    available: true,
    ownerName: "Ananya Iyer",
    ownerDepartment: "Arts",
    ownerSemester: "4th",
  },
  {
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    edition: "10th Edition",
    category: "Computer Science",
    condition: "Fair",
    description:
      "The famous dinosaur book. Used heavily during 5th semester OS course. Notes in margins, but all pages intact.",
    image: "https://picsum.photos/seed/osbook/400/550",
    available: true,
    ownerName: "Vikram Singh",
    ownerDepartment: "CSE",
    ownerSemester: "6th",
  },
  {
    title: "Quantitative Aptitude",
    author: "R.S. Aggarwal",
    edition: "Revised Edition",
    category: "Mathematics",
    condition: "Good",
    description:
      "Great for campus placements and bank exams. Practice sets mostly unused. Cover has slight wear.",
    image: "https://picsum.photos/seed/rsaggarwal/400/550",
    available: true,
    ownerName: "Sneha Reddy",
    ownerDepartment: "IT",
    ownerSemester: "5th",
  },
  {
    title: "A Brief History of Modern India",
    author: "Rajiv Ahir (Spectrum)",
    edition: "2023 Edition",
    category: "Humanities",
    condition: "New",
    description:
      "Spectrum book for modern Indian history. Unused — bought extra copy by mistake. Still has packaging feel.",
    image: "https://picsum.photos/seed/spectrum/400/550",
    available: false,
    ownerName: "Kabir Mehta",
    ownerDepartment: "History",
    ownerSemester: "3rd",
  },
  {
    title: "Fundamentals of Database Systems",
    author: "Elmasri & Navathe",
    edition: "7th Edition",
    category: "Computer Science",
    condition: "Good",
    description:
      "Standard DBMS textbook for B.Tech CSE/IT. Used for one semester. Diagrams are clean, no missing pages.",
    image: "https://picsum.photos/seed/dbms/400/550",
    available: true,
    ownerName: "Ishita Nair",
    ownerDepartment: "CSE",
    ownerSemester: "4th",
  },
  {
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    edition: "7th Edition",
    category: "Chemistry",
    condition: "Fair",
    description:
      "Classic organic chemistry book used in B.Sc and engineering chemistry courses. Some highlighting, readable throughout.",
    image: "https://picsum.photos/seed/organic/400/550",
    available: true,
    ownerName: "Aditya Joshi",
    ownerDepartment: "Chemical",
    ownerSemester: "3rd",
  },
  {
    title: "Indian Economy",
    author: "Ramesh Singh",
    edition: "14th Edition",
    category: "Business",
    condition: "Like New",
    description:
      "Popular book for college economics and competitive exams. Minimal use, no writing inside.",
    image: "https://picsum.photos/seed/economy/400/550",
    available: true,
    ownerName: "Meera Krishnan",
    ownerDepartment: "B.Com",
    ownerSemester: "2nd",
  },
  {
    title: "Basic Electrical Engineering",
    author: "V.K. Mehta & Rohit Mehta",
    edition: "Revised Edition",
    category: "Engineering",
    condition: "Good",
    description:
      "Covers circuit theory, transformers, and AC/DC machines for 1st-year engineering students. Very helpful circuit diagrams.",
    image: "https://picsum.photos/seed/electrical/400/550",
    available: true,
    ownerName: "Rahul Verma",
    ownerDepartment: "EE",
    ownerSemester: "1st",
  },
  {
    title: "Microprocessor Architecture and Applications",
    author: "Ramesh S. Gaonkar",
    edition: "5th Edition",
    category: "Computer Science",
    condition: "Fair",
    description:
      "Standard book for 8085 assembly language and hardware architecture. Cover is slightly worn, content is clear.",
    image: "https://picsum.photos/seed/micro/400/550",
    available: true,
    ownerName: "Siddharth Rao",
    ownerDepartment: "ECE",
    ownerSemester: "5th",
  },
  {
    title: "Problems in General Physics",
    author: "I.E. Irodov",
    edition: "Classic Edition",
    category: "Physics",
    condition: "Like New",
    description:
      "Legendary physics problem book for physics majors and advanced mechanics prep. Unmarked, crisp pages.",
    image: "https://picsum.photos/seed/irodov/400/550",
    available: true,
    ownerName: "Tanvi Saxena",
    ownerDepartment: "Physics",
    ownerSemester: "3rd",
  },
  {
    title: "Financial Accounting",
    author: "S.N. Maheshwari",
    edition: "12th Edition",
    category: "Business",
    condition: "Good",
    description:
      "Covers ledger posting, balance sheets, and cash flow statements for B.Com / BBA students.",
    image: "https://picsum.photos/seed/accounting/400/550",
    available: true,
    ownerName: "Karan Malhotra",
    ownerDepartment: "BBA",
    ownerSemester: "1st",
  },
  {
    title: "Objective General English",
    author: "S.P. Bakshi",
    edition: "Latest Edition",
    category: "Literature",
    condition: "Good",
    description:
      "Covers grammar, vocabulary, and reading comprehension. Used for placement verbal ability preparation.",
    image: "https://picsum.photos/seed/english/400/550",
    available: true,
    ownerName: "Riya Das",
    ownerDepartment: "English",
    ownerSemester: "4th",
  },
  {
    title: "Cell Biology, Genetics & Ecology",
    author: "P.S. Verma & V.K. Agarwal",
    edition: "Multicolor Edition",
    category: "Biology",
    condition: "Good",
    description:
      "Comprehensive textbook for B.Sc Life Sciences and Biotechnology students with detailed biological diagrams.",
    image: "https://picsum.photos/seed/bio/400/550",
    available: true,
    ownerName: "Neaj Mukherjee",
    ownerDepartment: "Biotech",
    ownerSemester: "3rd",
  },
  {
    title: "Strength of Materials",
    author: "R.K. Bansal",
    edition: "6th Edition",
    category: "Engineering",
    condition: "Fair",
    description:
      "Covers stress, strain, bending moment, and shear force diagrams for Mechanical and Civil engineering students.",
    image: "https://picsum.photos/seed/som/400/550",
    available: true,
    ownerName: "Varun Choudhury",
    ownerDepartment: "Civil",
    ownerSemester: "4th",
  },
  {
    title: "Data Communications and Networking",
    author: "Behrouz A. Forouzan",
    edition: "5th Edition",
    category: "Computer Science",
    condition: "Like New",
    description:
      "Covers TCP/IP model, OSI layers, routing algorithms, and network security concepts for CSE/IT.",
    image: "https://picsum.photos/seed/networking/400/550",
    available: true,
    ownerName: "Divya Nambiar",
    ownerDepartment: "IT",
    ownerSemester: "6th",
  },
  {
    title: "Engineering Chemistry",
    author: "Jain & Jain",
    edition: "16th Edition",
    category: "Chemistry",
    condition: "Good",
    description:
      "Covers water technology, fuels, polymers, and corrosion for 1st-year engineering curriculum.",
    image: "https://picsum.photos/seed/engchem/400/550",
    available: true,
    ownerName: "Manish Pandey",
    ownerDepartment: "ME",
    ownerSemester: "1st",
  },
  {
    title: "Environment for Civil Services & College",
    author: "Shankar IAS Academy",
    edition: "9th Edition",
    category: "Humanities",
    condition: "New",
    description:
      "Covers ecology, biodiversity, climate change, and environmental laws. Completely clean, unused copy.",
    image: "https://picsum.photos/seed/environment/400/550",
    available: true,
    ownerName: "Pooja Agarwal",
    ownerDepartment: "Env Science",
    ownerSemester: "2nd",
  },
  {
    title: "Physical Chemistry",
    author: "O.P. Tandon",
    edition: "Latest Edition",
    category: "Chemistry",
    condition: "Good",
    description:
      "Covers thermodynamics, chemical kinetics, and electrochemistry with plenty of solved numerical problems.",
    image: "https://picsum.photos/seed/physicalchem/400/550",
    available: true,
    ownerName: "Harsh Vardhan",
    ownerDepartment: "Chem Engg",
    ownerSemester: "2nd",
  },
  {
    title: "Principles of Physics",
    author: "Resnick, Halliday, Walker",
    edition: "10th Edition",
    category: "Physics",
    condition: "Like New",
    description:
      "The gold standard physics text globally. Clear explanations and diagrams. Used for honors physics coursework.",
    image: "https://picsum.photos/seed/resnick/400/550",
    available: true,
    ownerName: "Shreya Kapoor",
    ownerDepartment: "Physics",
    ownerSemester: "4th",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    await Book.deleteMany({});
    console.log("🧹 Cleared existing books");

    const inserted = await Book.insertMany(books);
    console.log(`✅ Seeded ${inserted.length} books successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seed();
