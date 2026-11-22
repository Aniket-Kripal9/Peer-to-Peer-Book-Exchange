================================================================================
              BookSwap — Peer-to-Peer Book Exchange Platform
================================================================================

1. INTRODUCTION
--------------------------------------------------------------------------------
Every semester, university students run into the same problem: textbooks and
reference books are expensive to buy brand new, and once exams are over, last
semester's books just sit on a shelf collecting dust. Meanwhile, a junior in
the exact same department is looking for those very same books.

BookSwap was built to bridge that gap. It is a simple, student-friendly
Peer-to-Peer (P2P) Book Exchange web application designed for university
campuses. Instead of buying new books every term or letting old ones go to
waste, students can list the books they already own, browse what fellow
classmates are sharing across departments, and request a book exchange in just
a couple of clicks.

Whether it is a core Computer Science textbook like Cormen's Algorithms,
engineering math references, exam prep guides, or classic literature, BookSwap
keeps useful books moving from one student's desk to another.


2. HOW THE PROJECT WORKS (END-TO-END FLOW)
--------------------------------------------------------------------------------
The platform follows a straightforward flow from joining the community to
completing a book swap:

Step 1: Creating an Account & Logging In
  When a student opens BookSwap for the first time, they sign up using their
  full name, university email, department (CSE, ECE, ME, Civil, EE, etc.),
  and current semester. Once registered or logged in, their profile details
  are stored in the browser session so the app always knows who is listing or
  requesting a book.

Step 2: Exploring & Searching for Books
  From the Home Page, students see recently added books from around campus.
  Heading over to the "Browse Books" page gives them the full catalog along
  with three handy ways to narrow things down:
    - Keyword Search: Look up books by title or author in real time.
    - Category Filter: Filter by subject (Computer Science, Engineering,
      Mathematics, Physics, Chemistry, Literature, Humanities, Business, etc.).
    - Availability Filter: Switch between viewing All Books, Available Only,
      or books that have already been Exchanged.

Step 3: Listing a Book to Share
  Have a book you no longer need? On the "Add Book" page, any logged-in
  student can put a book up for exchange by entering its title, author,
  edition, category, physical condition (New, Like New, Good, Fair, Poor), a
  short description, and an optional cover image link. BookSwap automatically
  tags the listing with the student's name, department, and semester so peers
  know who owns it. Owners can also edit or remove their listings anytime.

Step 4: Sending an Exchange Request
  Clicking on any book opens its dedicated Book Detail page, showing the full
  description, edition, condition, and the owner's department and semester. If
  the book is available (and does not belong to the viewer), the student can
  hit "Request Exchange". The backend checks to make sure the book is still
  available and prevents duplicate pending requests from the same person.

Step 5: Managing Everything from the Dashboard
  The Dashboard acts as each student's personal control center and is split
  into three clean tabs:
    - My Listings: View all books you have shared, edit their details, or
      delete a listing.
    - Incoming Requests: See who wants to borrow or swap for your books,
      complete with the requester's name, department, and semester, and choose
      to Accept or Reject the request.
    - Sent Requests: Keep track of the books you have requested from others
      (Pending, Accepted, or Rejected), with the option to cancel a request if
      you no longer need it.

Step 6: Completing the Swap
  The moment a book owner clicks "Accept" on an incoming request, BookSwap
  updates the request status to "Accepted" and automatically marks that book
  as unavailable ("Exchanged") across the entire platform so nobody else sends
  requests for a book that has already been claimed.


3. UNDER THE HOOD (ARCHITECTURE & TECH STACK)
--------------------------------------------------------------------------------
BookSwap is built on the MERN stack (MongoDB, Express.js, React, Node.js),
organized into two main folders inside "Peer to Peer Book Exchange/":

Frontend (client/)
  - Built with React 19, Vite, React Router (HashRouter), and Bootstrap 5.
  - Uses Axios (src/api.js) to talk to the backend REST API.
  - Organized into reusable UI pieces (Navbar, Footer, BookCard, RequestCard,
    SearchBar) and focused pages (Login, Signup, Home, Browse Books, Book
    Detail, Add Book, Edit Book, and Dashboard).

Backend (server/)
  - Built with Node.js and Express.js, connected to MongoDB Atlas through
    Mongoose.
  - Structured cleanly using the MVC pattern:
      * Models (models/):
          - User.js: Stores student name, email, password, department, and
            semester.
          - Book.js: Stores book metadata, condition, cover image, owner info,
            and availability status.
          - Request.js: Links a requested Book ID with the requester's details,
            the owner's name, and the current status (Pending / Accepted /
            Rejected).
      * Controllers (controllers/): Holds the core logic for user sign-up and
        login, full CRUD operations + search/filtering for books, and exchange
        request handling.
      * Routes (routes/): Exposes clean REST endpoints under /api/users,
        /api/books, and /api/requests.
  - Includes database seed scripts (seed.js and seedRequests.js) pre-loaded
    with real academic textbooks and sample swap requests for quick testing.


4. RUNNING THE PROJECT LOCALLY
--------------------------------------------------------------------------------
1. Start the Backend Server:
     cd "Peer to Peer Book Exchange/server"
     npm install
     # Create a .env file with your MONGO_URI and PORT=5000
     npm run dev

   (Optional) To populate sample textbooks and requests in MongoDB:
     npm run seed
     npm run seed:requests

2. Start the Frontend App:
     cd "Peer to Peer Book Exchange/client"
     npm install
     npm run dev

================================================================================
         Built for students to share knowledge, save money, and read more.
================================================================================
