import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What is included in the Premium plan?',
      answer: 'Premium includes unlimited circles, advanced analytics, mood predictions, custom themes, priority support, and more. See the comparison table above for full details.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! You can cancel your Premium subscription at any time. Your Premium features will remain active until the end of your billing period.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. All your data is stored locally on your device by default. Premium features that sync data use end-to-end encryption. We never sell your data.'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! New users get a 7-day free trial of Premium. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Apple Pay. All payments are processed securely through Stripe.'
    },
    {
      question: 'Can I get a refund?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund.'
    }
  ]

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">{faq.question}</span>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} className="text-gray-500" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 text-gray-600">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
