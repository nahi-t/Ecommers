// src/pages/Contact.jsx
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: false, message: '' });

    // Simulate API call (replace with your real endpoint)
    try {
      // await axios.post('/api/contact', formData);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // fake delay

      setStatus({
        loading: false,
        success: true,
        error: false,
        message: 'Thank you! Your message has been sent successfully.',
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-200">

      {/* Hero / Header */}
      <div className="hero bg-base-100 py-16 md:py-24">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8">
              We'd love to hear from you. Whether you have a question about products,
              need help with an order, or just want to say hello — we're here for you.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

        {/* Contact Info + Form Grid */}
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">

            {/* Card 1 - Address */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                    <span className="iconify" data-icon="mdi:map-marker-outline"></span>
                  </div>
                  <h3 className="card-title">Our Location</h3>
                </div>
                <p className="opacity-75">
                  Dire Dawa, Ethiopia<br />
                  Main Market Area<br />
                  Near Main Bus Station
                </p>
              </div>
            </div>

            {/* Card 2 - Email & Phone */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                    <span className="iconify" data-icon="mdi:email-outline"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Us</h4>
                    <a href="mailto:support@yourshop.et" className="link link-primary">
                      support@yourshop.et
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0">
                    <span className="iconify" data-icon="mdi:phone-outline"></span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Call Us</h4>
                    <p>+251 9xx xxx xxx</p>
                    <p className="text-sm opacity-70">Mon–Sat: 8:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center lg:justify-start gap-4 mt-6">
              <a href="#" className="btn btn-circle btn-outline tooltip" data-tip="Telegram">
                <span className="iconify text-xl" data-icon="mdi:telegram"></span>
              </a>
              <a href="#" className="btn btn-circle btn-outline tooltip" data-tip="Facebook">
                <span className="iconify text-xl" data-icon="mdi:facebook"></span>
              </a>
              <a href="#" className="btn btn-circle btn-outline tooltip" data-tip="Instagram">
                <span className="iconify text-xl" data-icon="mdi:instagram"></span>
              </a>
              <a href="#" className="btn btn-circle btn-outline tooltip" data-tip="TikTok">
                <span className="iconify text-xl" data-icon="mdi:tiktok"></span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-2xl">
              <div className="card-body p-8 lg:p-12">
                <h2 className="card-title text-3xl mb-8">Send us a Message</h2>

                {status.success && (
                  <div className="alert alert-success mb-8">
                    <span>{status.message}</span>
                  </div>
                )}

                {status.error && (
                  <div className="alert alert-error mb-8">
                    <span>{status.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Your Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email Address</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Subject</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Message</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="textarea textarea-bordered h-40"
                      placeholder="How can we help you today?"
                      required
                    ></textarea>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg ${status.loading ? 'btn-disabled' : ''}`}
                      disabled={status.loading}
                    >
                      {status.loading ? (
                        <>
                          <span className="loading loading-spinner"></span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Google Map / Location Embed */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Find Us Here</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-base-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.123456789!2d41.866666!3d9.593333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzUnMzYuMCJOIDQxwrA1MicwMC4wIkU!5e0!3m2!1sen!2set!4v1698765432100!5m2!1sen!2set"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our location in Dire Dawa"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;