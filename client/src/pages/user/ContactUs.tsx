// import React from 'react'

const ContactUs = () => {
  return (
    <div className="space-y-8 pt-[90px] pb-10 bg-luxury-ink min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-logo text-4xl font-bold text-luxury-cream mb-4">Contact Us</h1>
        <p className="text-lg text-luxury-cream/70">
          Get in touch with us. We'd love to hear from you!
        </p>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-luxury-ink border border-luxury-gold/10 rounded-lg shadow-md p-8">
          <h2 className="font-logo text-2xl font-bold text-luxury-cream mb-6">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-luxury-cream/70 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold/60"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-cream/70 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold/60"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-cream/70 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold/60"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-luxury-cream/70 mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold/60"
                placeholder="Enter your message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-ink py-3 px-4 rounded-md font-semibold transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
