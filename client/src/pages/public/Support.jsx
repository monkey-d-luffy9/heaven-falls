import { useState } from 'react';
import {
    MessageCircle,
    Mail,
    Phone,
    Clock,
    Send,
    Facebook,
    HelpCircle,
    CheckCircle
} from 'lucide-react';
import './Support.css';

export default function Support() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would send to a backend
        console.log('Support request:', formData);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const faqItems = [
        {
            question: 'How do I claim my daily bonus?',
            answer: 'Log in to your account and go to the Bonus Center. Click "Claim Now" on any available bonus. Bonuses refresh based on their cooldown period.'
        },
        {
            question: 'Why is my bonus game showing a cooldown?',
            answer: 'Each game has a cooldown period (usually 24 hours). After playing, you need to wait for the cooldown to expire before playing again.'
        },
        {
            question: 'How do I refer a friend?',
            answer: 'Go to your Profile page and copy your unique referral code or link. Share it with friends - you both earn credits when they sign up!'
        },
        {
            question: 'How do I upgrade my VIP tier?',
            answer: 'Earn loyalty points by playing games and claiming bonuses. Your tier automatically upgrades when you reach the required points.'
        },
        {
            question: 'I forgot my password. What do I do?',
            answer: 'Contact our support team via Facebook or the form below with your username, and we\'ll help you reset your password.'
        }
    ];

    return (
        <div className="support-page">
            {/* Hero Section */}
            <section className="support-hero">
                <h1>How Can We Help?</h1>
                <p>Our support team is here to assist you</p>
            </section>

            {/* Contact Options */}
            <section className="contact-options">
                <div className="contact-card facebook">
                    <Facebook size={32} />
                    <h3>Facebook Support</h3>
                    <p>Message us on Facebook for fastest response</p>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        <MessageCircle size={18} />
                        Message Us
                    </a>
                </div>

                <div className="contact-card email">
                    <Mail size={32} />
                    <h3>Email Support</h3>
                    <p>Send us an email and we'll respond within 24 hours</p>
                    <a href="mailto:support@loyaltygamehub.com" className="btn btn-secondary">
                        <Send size={18} />
                        Send Email
                    </a>
                </div>

                <div className="contact-card hours">
                    <Clock size={32} />
                    <h3>Support Hours</h3>
                    <p>We're available to help you</p>
                    <div className="hours-list">
                        <span>Mon - Fri: 9AM - 9PM</span>
                        <span>Sat - Sun: 10AM - 6PM</span>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="support-faq">
                <h2>
                    <HelpCircle size={24} />
                    Frequently Asked Questions
                </h2>
                <div className="faq-accordion">
                    {faqItems.map((item, index) => (
                        <details key={index} className="faq-item">
                            <summary>{item.question}</summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="contact-form-section">
                <h2>
                    <Send size={24} />
                    Send Us a Message
                </h2>

                {submitted ? (
                    <div className="form-success">
                        <CheckCircle size={48} />
                        <h3>Message Sent!</h3>
                        <p>We've received your message and will get back to you within 24 hours.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setSubmitted(false)}
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <select
                                className="form-input"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            >
                                <option value="">Select a topic</option>
                                <option value="account">Account Issues</option>
                                <option value="bonus">Bonus & Credits</option>
                                <option value="games">Game Problems</option>
                                <option value="vip">VIP & Rewards</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-input"
                                rows="5"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your issue or question in detail..."
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-gold btn-lg">
                            <Send size={18} />
                            Send Message
                        </button>
                    </form>
                )}
            </section>
        </div>
    );
}
