// import Iridescence from "@/components/Backgrounds/Iridescence/Iridescence";

// export default function Home() {
//   return (
//     <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4">
//       {/* Uncomment Iridescence if needed */}
//       {/* <Iridescence
//         color={[0.85, 0.95, 1]}
//         mouseReact={false}
//         amplitude={0.1}
//         speed={1.0}
//       /> */}

//       <div className="w-full max-w-6xl flex flex-col md:flex-row items-stretch">
//         {/* Left - Welcome Message */}
//         <div className="md:w-1/2 p-6 md:pr-8">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Welcome to <span className="dancing-script">CliniCall</span>
//           </h1>
//           <p className="text-lg md:text-xl text-gray-700">
//             Your health, our priority. Schedule your appointment today!
//           </p>
//         </div>

//         {/* Vertical Divider on Desktop / Horizontal Divider on Mobile */}
//         <div className="hidden md:block w-px bg-gray-300"></div>
//         <div className="block md:hidden h-px bg-gray-300 my-4"></div>

//         {/* Right - Company Goals & Mottos */}
//         <div className="md:w-1/2 p-6 md:pl-8">
//           <h2 className="text-2xl md:text-4xl font-semibold mb-2">
//             Our Mission
//           </h2>
//           <p className="text-base md:text-lg text-gray-700 mb-4">
//             To revolutionize healthcare accessibility with streamlined online
//             appointments and trustworthy professional care.
//           </p>
//           <h2 className="text-2xl md:text-4xl font-semibold mb-2">Our Motto</h2>
//           <p className="text-base md:text-lg text-gray-700">
//             “Care when you need it — fast, reliable, and compassionate.”
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { signIn } from "@/auth";
import SpotlightCard from "@/components/others/SpotlightCard/SpotlightCard";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 md:px-12 py-10 bg-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 mb-20">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="dancing-script">CliniCall</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Your health, our priority. Book appointments with trusted doctors
            anytime, anywhere.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/home" });
            }}
          >
            <button
              type="submit"
              className="bg-black flex flex-row gap-3 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition duration-200"
            >
              Book an Appointment
            </button>
          </form>
        </div>
        <div className="md:w-1/2">
          <img
            src="/image.png"
            alt="Online doctor consultation"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* About Us / Mission */}
      <section className="mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Why CliniCall?
        </h2>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
          At CliniCall, we passionately believe that healthcare should be
          nothing short of extraordinary—effortlessly simple, universally
          accessible, and profoundly human. Our mission is not just to connect
          patients with qualified medical professionals; it's to create a
          revolutionary, seamless digital experience that feels like having the
          world’s best doctors right at your fingertips!
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">1. Find a Doctor</h3>
            <p className="text-gray-600">
              Search by specialty, location, or availability and view detailed
              doctor profiles.
            </p>
          </div>
          <div className="p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">
              2. Book an Appointment
            </h3>
            <p className="text-gray-600">
              Choose your preferred time slot and day. Confirm instantly.
            </p>
          </div>
          <div className="p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">3. Get Consultation</h3>
            <p className="text-gray-600">
              Visit the clinic and receive personalized care from your chosen
              specialist.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <h4 className="text-lg font-semibold mb-2 text-white">
              24/7 Booking
            </h4>
            <p className="text-gray-400">
              Schedule appointments anytime, anywhere. Our platform is available
              24/7 for your convenience.
            </p>
          </SpotlightCard>
          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <h4 className="text-lg font-semibold mb-2 text-white">
              Verified Doctors
            </h4>
            <p className="text-gray-400">
              Only certified professionals across all specialties.
            </p>
            ={" "}
          </SpotlightCard>

          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <h4 className="text-lg font-semibold mb-2 text-white">
              Secure Records
            </h4>
            <p className="text-gray-400">
              Your personal and medical data is encrypted and protected.
            </p>
          </SpotlightCard>

          <SpotlightCard
            className="custom-spotlight-card"
            spotlightColor="rgba(255, 255, 255, 0.2)"
          >
            <h4 className="text-lg font-semibold mb-2 text-white">
              Dashboard Overview
            </h4>
            <p className="text-gray-400">
              See all your upcoming appointments and details in one place.
            </p>
          </SpotlightCard>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">
          What Our Patients Say
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="p-6 rounded-xl border shadow-sm max-w-md mx-auto">
            <p className="italic text-gray-700 mb-2">
              “CliniCall made it so easy to find a pediatrician for my daughter.
              Highly recommended!”
            </p>
            <p className="font-semibold">— Anjali R.</p>
          </div>
          <div className="p-6 rounded-xl border shadow-sm max-w-md mx-auto">
            <p className="italic text-gray-700 mb-2">
              “I booked a dermatologist within minutes. The online consultation
              went smoothly!”
            </p>
            <p className="font-semibold">— Karthik M.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
