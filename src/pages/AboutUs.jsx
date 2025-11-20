import React from 'react';
import { Palette, Shirt, Sparkles, Users, Target, Heart } from 'lucide-react';
import { Link } from "react-router-dom";
function Aboutus(props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Design Your Story
                    </h1>
                    <p className="text-xl md:text-2xl opacity-90 mb-4">
                        Where creativity meets fashion
                    </p>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto">
                        Transform your ideas into wearable art with our revolutionary 3D t-shirt design platform
                    </p>
                </div>
                <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>

            {/* Mission Section */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We empower individuals to express their unique style through innovative technology. 
                        Our 3D design platform makes custom t-shirt creation accessible, fun, and incredibly personal.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                            <Palette className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">3D Design Studio</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Visualize your design in real-time with our advanced 3D t-shirt model. 
                            Add images, text, and see every detail before you buy.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Unlimited Creativity</h3>
                        <p className="text-gray-600 leading-relaxed">
                            No design skills required. Our intuitive tools let anyone create professional-looking 
                            custom t-shirts in minutes.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                            <Shirt className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Quality Guaranteed</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Premium fabrics, vibrant prints, and careful attention to detail ensure your 
                            custom design looks amazing and lasts.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What We Stand For</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Target className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
                            <p className="text-gray-600">
                                Pushing boundaries with cutting-edge 3D technology that transforms the design experience
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Heart className="w-10 h-10 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Passion</h3>
                            <p className="text-gray-600">
                                Dedicated to helping you express yourself through unique, personalized fashion
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Users className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Community</h3>
                            <p className="text-gray-600">
                                Building a creative community where everyone can be a designer
                            </p>
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white rounded-3xl p-12 shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        We started with a simple belief: everyone should be able to create custom apparel that 
                        truly represents who they are. Traditional design tools were complicated, and existing 
                        platforms didn't give customers a true sense of what their final product would look like.
                    </p>
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                        That's why we built a revolutionary 3D design platform that puts the power of professional 
                        customization in your hands. Whether you're designing for yourself, your team, or your brand, 
                        our intuitive tools make the process enjoyable and the results stunning.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Today, we're proud to serve thousands of creators who trust us to bring their visions to life. 
                        Thank you for being part of our journey, and we are constantly inspired by what you create.
                    </p>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-6">
    <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Create?</h2>
        <p className="text-xl mb-8 opacity-90">
            Start designing your custom t-shirt today with our 3D design studio
        </p>

        <Link to="/design">
            <button className="bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Start Designing
            </button>
        </Link>
    </div>
</div>
        </div>
    );
}

export default Aboutus;