// src/pages/About.jsx
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-base-200">

      {/* Hero Section */}
      <div className="hero min-h-[60vh] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Us
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-base-content/80">
              We're building the future of e-commerce in Ethiopia — simple, fast, and trusted.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Start Shopping
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed mb-6">
              To make quality products accessible to every Ethiopian household through a seamless,
              reliable, and affordable online shopping experience — no matter where you are.
            </p>
            <p className="text-lg leading-relaxed">
              We believe shopping should be simple, safe, and something to look forward to.
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl">Our Values</h3>
              <ul className="space-y-4 mt-4">
                <li className="flex items-start gap-3">
                  <span className="badge badge-lg badge-primary">01</span>
                  <span>Trust & Transparency</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-lg badge-primary">02</span>
                  <span>Customer First</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-lg badge-primary">03</span>
                  <span>Speed & Reliability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-lg badge-primary">04</span>
                  <span>Local Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">5K+</div>
              <div className="text-lg opacity-70">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">1.2K+</div>
              <div className="text-lg opacity-70">Products</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-lg opacity-70">On-time Delivery</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">24/7</div>
              <div className="text-lg opacity-70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Nahom T.",
                role: "Founder & CEO",
                image: "https://ui-avatars.com/api/?name=Nahom+T.&background=0D8ABC&color=fff",
              },
              {
                name: "Sara A.",
                role: "Head of Operations",
                image: "https://ui-avatars.com/api/?name=Sara+A.&background=8E44AD&color=fff",
              },
              {
                name: "Yonas K.",
                role: "Lead Developer",
                image: "https://ui-avatars.com/api/?name=Yonas+K.&background=E74C3C&color=fff",
              },
            ].map((person, idx) => (
              <div key={idx} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="px-10 pt-10">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="rounded-full w-48 h-48 object-cover mx-auto"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-xl">{person.name}</h3>
                  <p className="text-base-content/70">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-content">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Shop?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of happy customers across Ethiopia.
          </p>
          <Link to="/shop" className="btn btn-secondary btn-lg">
            Browse Products →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;