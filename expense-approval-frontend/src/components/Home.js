import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-4 px-8 shadow-sm bg-white sticky top-0 z-50">
        <div className="text-2xl font-bold text-blue-600">💰 BudgetSphere</div>
        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">
            How it Works
          </a>
          <a href="#testimonials" className="hover:text-blue-600 transition">
            Testimonials
          </a>
        
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-r from-blue-50 via-white to-purple-50">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Smarter Expense Management with{" "}
          <span className="text-blue-600">BudgetSphere</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Track expenses, approve budgets in real-time, and gain valuable
          insights—all in one simple dashboard.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          🌟 Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Real-Time Expense Approval
            </h3>
            <p className="text-gray-600">
              Submit, review, and approve expenses instantly with live
              notifications.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Budget Tracking & Analytics
            </h3>
            <p className="text-gray-600">
              Monitor your budgets with interactive charts and insights.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              JWT-based login ensures safe access to your financial data.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 px-6 bg-gradient-to-r from-blue-50 via-white to-purple-50"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          🔎 How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📌</div>
            <h3 className="text-xl font-semibold mb-2">1. Register</h3>
            <p className="text-gray-600">
              Create your account in seconds with secure registration.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-semibold mb-2">2. Add Expenses</h3>
            <p className="text-gray-600">
              Enter expenses and submit them for approval instantly.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">3. Track & Analyze</h3>
            <p className="text-gray-600">
              Get real-time insights and reports on spending patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
  id="testimonials"
  className="py-20 px-6 bg-gradient-to-r from-blue-50 via-white to-blue-50"
>
  {/* Heading */}
  <h2 className="text-4xl font-extrabold text-center mb-16 text-gray-900 tracking-tight">
    💬 What People Say About <span className="text-blue-600">BudgetSphere</span>
  </h2>

  {/* Testimonials Grid */}
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
    
    {/* Card 1 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in">
      <p className="text-gray-600 italic leading-relaxed">
        "BudgetSphere has simplified our company’s expense approval process. Fast and secure!"
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=12" alt="manager" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– A Manager</p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-200">
      <p className="text-gray-600 italic leading-relaxed">
        "I love the analytics feature—it helps me keep track of where my money goes."
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=32" alt="employee" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– An Employee</p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-300">
      <p className="text-gray-600 italic leading-relaxed">
        "The approval notifications save me so much time. No more manual follow-ups!"
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=45" alt="team lead" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– Team Lead</p>
      </div>
    </div>

    {/* Card 4 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-500">
      <p className="text-gray-600 italic leading-relaxed">
        "As a finance officer, I can instantly track budgets and generate reports—super efficient!"
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=8" alt="finance officer" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– Finance Officer</p>
      </div>
    </div>

    {/* Card 5 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-700">
      <p className="text-gray-600 italic leading-relaxed">
        "The dashboard gives me a clear overview of expenses at a glance. Very user-friendly!"
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=23" alt="project manager" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– Project Manager</p>
      </div>
    </div>

    {/* Card 6 */}
    <div className="p-8 bg-white shadow-lg rounded-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in delay-900">
      <p className="text-gray-600 italic leading-relaxed">
        "Secure, fast, and reliable. BudgetSphere has changed how our team manages expenses."
      </p>
      <div className="mt-6 flex items-center gap-4">
        <img src="https://i.pravatar.cc/50?img=41" alt="HR" className="w-10 h-10 rounded-full" />
        <p className="font-semibold text-blue-600">– HR Specialist</p>
      </div>
    </div>
  </div>
</section>

      
    </div>
  );
};

export default HomePage;
