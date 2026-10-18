function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer mt-auto">
      <div className="container text-center py-4">
        <p className="mb-1 fw-semibold">📚 BookSwap</p>
        <p className="mb-0 small text-light opacity-75">
          Peer-to-Peer Book Exchange for University Students
        </p>
        <hr className="my-3 border-light opacity-25" />
        <p className="mb-0 small text-light opacity-50">
          &copy; {currentYear} BookSwap. Made with ❤️ by students, for students.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
