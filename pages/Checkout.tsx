import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Layout/Navbar';
import { Footer } from '../components/Layout/Footer';
import { ShieldCheck, Lock, Loader2, ArrowLeft, CheckCircle, Smartphone, Upload, Camera } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, updateData } = useContent();
  const { user } = useAuth();
  
  const course = data.courses.find(c => c.id === id);
  const [step, setStep] = useState<'qr' | 'form' | 'success'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      mobile: '',
      amount: course?.price.toString() || '',
      transactionId: '',
      screenshot: ''
  });

  if (!course) return <div>Course not found</div>;
  if (!user) {
      navigate('/login');
      return null;
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, screenshot: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Transaction ID must be at least 12 characters
    if (formData.transactionId.trim().length < 12) {
        alert("Please enter a valid Transaction ID (minimum 12 digits).");
        return;
    }

    setIsProcessing(true);

    // 1. Save to Internal System (Admin Panel)
    const newVerification = {
        id: Date.now().toString(),
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        amount: formData.amount,
        transactionId: formData.transactionId,
        screenshot: formData.screenshot,
        date: new Date().toISOString(),
        status: 'pending' as const
    };

    // Update global state which Admin Panel reads
    const updatedVerifications = [...(data.paymentVerifications || []), newVerification];
    updateData({ ...data, paymentVerifications: updatedVerifications });

    // 2. Prepare Email Body for mailto
    const subject = encodeURIComponent(`Payment Verification: ${course.title}`);
    const body = encodeURIComponent(
`Payment Details:
----------------
Name: ${formData.name}
Email: ${formData.email}
Mobile: ${formData.mobile}
Course: ${course.title}
Amount Paid: ₹${formData.amount}
Transaction ID: ${formData.transactionId}

Note: Screenshot is attached in the system. Please verify in Admin Panel.
`
    );

    // Simulate "Sending" delay
    setTimeout(() => {
        setIsProcessing(false);
        setStep('success');
        
        // Attempt to open email client
        window.location.href = `mailto:businessabhinav66@gmail.com?subject=${subject}&body=${body}`;
    }, 1500);
  };

  if (step === 'success') {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Sent Successfully!</h2>
                  <p className="text-slate-600 mb-6">
                      We have received your payment details. Admin will verify your transaction and grant access to the course shortly.
                  </p>
                  <p className="text-xs text-slate-400 mb-6">
                     An email window may have opened for you to send these details as backup.
                  </p>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                  >
                      Go to Dashboard
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-24">
         <button 
            onClick={() => {
                if(step === 'form') setStep('qr');
                else navigate(-1);
            }} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium"
         >
            <ArrowLeft size={18} /> {step === 'form' ? 'Back to QR' : 'Back'}
         </button>

         <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Secure Checkout</h2>

                    {step === 'qr' && (
                        <div className="flex flex-col items-center">
                             {/* Display Uploaded QR Image if available, otherwise Fallback to Generated One */}
                             {data.general.paymentQrImage ? (
                                <div className="max-w-sm w-full mx-auto mb-8">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                                        <img 
                                            src={data.general.paymentQrImage} 
                                            alt="Payment QR" 
                                            className="w-full h-auto" 
                                        />
                                    </div>
                                    <p className="text-center text-sm text-slate-500 mt-4">
                                        Scan this QR code using any UPI App to pay <strong>₹{course.price.toLocaleString()}</strong>
                                    </p>
                                </div>
                             ) : (
                                 /* Fallback Generated UI */
                                 <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-200 max-w-sm w-full mx-auto relative overflow-hidden">
                                    {/* Top Logo Section */}
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-[#6739b7] rounded-full flex items-center justify-center">
                                                 {/* Devanagari Pe */}
                                                 <span className="text-white font-bold text-2xl pb-1">पे</span>
                                            </div>
                                            <span className="text-[#2c2c2c] font-bold text-2xl">PhonePe</span>
                                        </div>
                                        <div className="text-[#6739b7] font-bold tracking-widest text-sm mb-4">
                                            ACCEPTED HERE
                                        </div>
                                        <p className="text-slate-600 font-medium">Scan & Pay Using PhonePe App</p>
                                    </div>

                                    {/* QR Code Section */}
                                    <div className="relative w-64 h-64 mx-auto mb-6">
                                         <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=upi://pay?pa=9305298053@ybl&pn=AnshKumar&am=${course.price}&cu=INR`} 
                                            alt="Payment QR" 
                                            className="w-full h-full object-contain mix-blend-multiply"
                                         />
                                         {/* Center Logo Overlay */}
                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-10 h-10 bg-white p-0.5 rounded-full shadow-sm flex items-center justify-center">
                                                <div className="w-full h-full bg-[#6739b7] rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm pb-0.5">पे</span>
                                                </div>
                                            </div>
                                         </div>
                                    </div>

                                    {/* Name Section */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-xl font-bold text-slate-900">ANSH KUMAR</h3>
                                    </div>

                                    {/* Footer Section */}
                                    <div className="text-center mt-4">
                                        <p className="text-[10px] text-slate-500 leading-tight">
                                            © 2025, All rights reserved, PhonePe Ltd (Formerly known as 'PhonePe Private Ltd')
                                        </p>
                                    </div>
                                 </div>
                             )}

                             {/* Action Button */}
                             <div className="mt-8 text-center">
                                <p className="text-slate-600 mb-4 font-medium">Total Amount: <span className="text-slate-900 font-bold">₹{course.price.toLocaleString()}</span></p>
                                <button 
                                    onClick={() => setStep('form')}
                                    className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-indigo-200"
                                >
                                    I have made the payment <ArrowLeft size={18} className="rotate-180"/>
                                </button>
                             </div>
                        </div>
                    )}

                    {step === 'form' && (
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                             <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Almost done!</strong> Please provide your payment details below so we can verify and grant you access immediately.
                                </p>
                             </div>

                             <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-indigo-500 outline-none"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                    <input 
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-indigo-500 outline-none"
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
                                    <input 
                                        required
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={e => setFormData({...formData, mobile: e.target.value})}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-indigo-500 outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Amount Paid <span className="text-red-500">*</span></label>
                                    <input 
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        className="w-full px-4 py-3 rounded border border-slate-200 focus:border-indigo-500 outline-none"
                                        placeholder="4999"
                                    />
                                </div>
                             </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">UPI Transaction ID (UTR) <span className="text-red-500">*</span></label>
                                <input 
                                    required
                                    minLength={12}
                                    value={formData.transactionId}
                                    onChange={e => setFormData({...formData, transactionId: e.target.value})}
                                    className="w-full px-4 py-3 rounded border border-slate-200 focus:border-indigo-500 outline-none"
                                    placeholder="e.g. 3214XXXXXXXX (Min 12 digits)"
                                />
                             </div>

                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Screenshot <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                    <input 
                                        required
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleScreenshotUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {formData.screenshot ? (
                                        <div className="flex flex-col items-center">
                                            <img src={formData.screenshot} alt="Preview" className="h-32 object-contain mb-2 shadow-sm rounded" />
                                            <span className="text-green-600 text-sm font-medium">Image Selected</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-500">
                                            <Upload size={32} className="mb-2" />
                                            <span className="text-sm">Click to upload screenshot</span>
                                            <span className="text-xs text-slate-400 mt-1">JPG, PNG (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                             </div>

                             <button 
                                type="submit" 
                                disabled={isProcessing}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
                             >
                                {isProcessing ? <Loader2 className="animate-spin" /> : 'Send Message to Admin'}
                             </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Order Summary - Keeps running on side */}
            <div className="lg:col-span-1 h-fit">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                    <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                    
                    <div className="flex gap-4 mb-6">
                        <img src={course.thumbnail} className="w-20 h-14 object-cover rounded bg-slate-100" alt="thumb"/>
                        <div>
                            <h4 className="font-semibold text-sm text-slate-900 line-clamp-2">{course.title}</h4>
                            <p className="text-xs text-slate-500">{course.instructor}</p>
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-100 pt-4 mb-4">
                         <div className="flex justify-between text-sm text-slate-600">
                             <span>Price</span>
                             <span className="font-bold text-slate-900">₹{course.price.toLocaleString()}</span>
                         </div>
                    </div>
                    
                    <div className="bg-indigo-50 p-3 rounded text-xs text-indigo-700 flex gap-2">
                        <ShieldCheck size={16} className="shrink-0" />
                        <p>Access granted after admin verification.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>
      
      <Footer />
    </div>
  );
};