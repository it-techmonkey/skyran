import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Building } from "lucide-react";
import { createPortal } from "react-dom";
import logo from '../../assets/skyran_logo.png';

export default function ChatBot({ isOpen: externalIsOpen, onClose } = {}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use external state if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        } else {
            setInternalIsOpen(false);
        }
    }, [onClose]);

    const handleOpen = useCallback(() => {
        if (externalIsOpen === undefined) {
            setInternalIsOpen(true);
        }
    }, [externalIsOpen]);

    const greetings = [
        "👋 Hey there! Welcome to SkyRan Real Estate!",
        "🌟 Hello! Ready to find your dream property?",
        "🏠 Hi! SkyRan Real Estate at your service!",
    ];

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            text: `${greetings[Math.floor(Math.random() * greetings.length)]}\n\nI'm your property assistant, and I'm super excited to help you discover amazing  properties in Dubai! 🚀\n\nLet's make this quick and easy. I just need to know your budget and preferred developer.\n\nFirst things first - what's your budget range? 💰`,
            options: ["Under 1M", "1M - 2M", "2M - 5M", "Custom Budget"],
        },
    ]);
    const [input, setInput] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [searchData, setSearchData] = useState({});
    const [isSearching, setIsSearching] = useState(false);

    const chatRef = useRef(null);

    // Helper function to format price display
    const formatPrice = (price) => {
        if (price < 1000000) {
            return `${Math.round(price / 1000)}K`;
        } else {
            return `${(price / 1000000).toFixed(2)}M`;
        }
    };

    const developers = ["EMAAR", "Sobha", "DAMAC", "Meraas", "Deyaar", "Arada", "Any Developer"];

    const funFacts = [
        "💡 Did you know? Dubai has over 200 skyscrapers!",
        "🌆 Fun fact: Dubai's property market is one of the world's most dynamic!",
        "✨ Interesting: Off-plan properties often offer better payment plans!",
        "🎯 Tip: EMAAR properties typically have excellent resale value!",
    ];

    // Helper function to parse user input
    const parseUserInput = (input) => {
        const lowerInput = input.toLowerCase();
        const parsed = {};

        // Extract developer
        for (const dev of developers) {
            if (dev !== "Any Developer" && lowerInput.includes(dev.toLowerCase())) {
                parsed.developer = dev;
                break;
            }
        }

        // Extract price logic (simplified for JS)
        const millionPattern = /(\d+\.?\d*)\s*(?:m|million)/i;
        const match = input.match(millionPattern);
        if (match) {
            const val = parseFloat(match[1]) * 1000000;
            if (lowerInput.includes('under') || lowerInput.includes('max')) {
                parsed.maxPrice = val;
            } else if (lowerInput.includes('over') || lowerInput.includes('min')) {
                parsed.minPrice = val;
            } else {
                // range logic can be complex, default to generic if just number found
                parsed.maxPrice = val;
            }
        }

        return parsed;
    };

    // Auto-scroll
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const addMessage = (text, options, isTyping = false, properties = []) => {
        const message = {
            id: Date.now(),
            sender: "bot",
            text,
            options,
            isTyping,
            properties
        };
        setMessages(prev => [...prev, message]);
    };

    const handleOptionClick = (option) => {
        const userMsg = { id: Date.now(), sender: "user", text: option };
        setMessages(prev => [...prev, userMsg]);

        const actions = {
            "Try Again": () => setTimeout(performSearch, 500),
            "Start New Search": () => resetChat(),
            "Adjust Filters": () => resetChat(),
            "Refine Search": () => resetChat(),
            "Continue Searching": () => resetChat(),
            "Contact Agent": () => showAgentInfo(),
            "Contact Support": () => showAgentInfo(),
            "See More Properties": () => showBrowseAll(),
            "Browse All": () => showBrowseAll(),
        };

        if (actions[option]) {
            actions[option]();
            return;
        }

        setTimeout(() => {
            handleBotResponse(option);
        }, 1000);
    };

    const resetChat = () => {
        setTimeout(() => {
            setCurrentStep(0);
            setSearchData({});
            addMessage(
                "Perfect! Let's find you another great property! 🔍\n\nWhat's your budget range?",
                ["Under 1M", "1M - 2M", "2M - 5M", "Custom Budget"]
            );
        }, 1000);
    };

    const showAgentInfo = () => {
        setTimeout(() => {
            addMessage(
                "📞 I'd be happy to connect you with our expert team!\n\nYou can reach us at:\n\n📍 Address:\nOntario Tower - Business Bay\nDubai - UAE\n\n📱 Phone:\n+971 4 272 5641\n\nOur team is ready to help you find your perfect property! Would you like to continue searching?",
                ["Continue Searching", "Start New Search"]
            );
        }, 1000);
    };

    const showBrowseAll = () => {
        setTimeout(() => {
            addMessage(
                "For a complete list of all available properties, please visit our listings page or I can help you refine your search criteria.\n\nWhat would you like to do?",
                ["Refine Search", "Start New Search", "Contact Agent"]
            );
        }, 1000);
    };

    const handleBotResponse = (userInput) => {
        switch (currentStep) {
            case 0: // Budget
                let minPrice, maxPrice;
                const isButtonOption = ["Under 1M", "1M - 2M", "2M - 5M", "Custom Budget"].includes(userInput);

                if (isButtonOption) {
                    switch (userInput) {
                        case "Under 1M": maxPrice = 1000000; break;
                        case "1M - 2M": minPrice = 1000000; maxPrice = 2000000; break;
                        case "2M - 5M": minPrice = 2000000; maxPrice = 5000000; break;
                        case "Custom Budget":
                            addMessage(
                                "No problem! 📝\n\nPlease type your budget range.\nFor example: '1.5M' or 'Max 3M'\n\n(Note: We show properties up to AED 5M)",
                                undefined
                            );
                            return;
                    }
                } else {
                    const parsed = parseUserInput(userInput);
                    if (parsed.minPrice || parsed.maxPrice) {
                        minPrice = parsed.minPrice;
                        maxPrice = parsed.maxPrice;
                    } else {
                        addMessage(
                            "I couldn't quite understand that budget. 🤔\n\nCould you try again? buttons are easier!",
                            ["Under 1M", "1M - 2M", "2M - 5M"]
                        );
                        return;
                    }
                }

                setSearchData(prev => ({ ...prev, minPrice, maxPrice }));

                const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
                setTimeout(() => { addMessage(randomFact, undefined); }, 800);

                setTimeout(() => {
                    const budgetStr = `${minPrice ? `AED ${(minPrice / 1000000).toFixed(1)}M` : 'Any'} - ${maxPrice ? `AED ${(maxPrice / 1000000).toFixed(1)}M` : 'No limit'}`;
                    addMessage(
                        `Awesome! Budget range set to ${budgetStr}. 💎\n\nNow, which developer catches your eye? We have some fantastic options!`,
                        developers
                    );
                }, 2000);
                setCurrentStep(1);
                break;

            case 1: // Developer
                if (userInput !== "Any Developer") {
                    setSearchData(prev => ({ ...prev, developer: userInput }));
                }

                addMessage(
                    `${userInput !== "Any Developer" ? `Excellent choice! ${userInput} builds stunning properties! 🏗️` : 'Great! We\'ll search across all developers! 🌟'}\n\nGive me a moment while I search our database...`,
                    undefined
                );

                setTimeout(() => {
                    performSearch();
                }, 1500);
                break;

            default:
                addMessage(
                    "I'm here to help you find properties! You can start a new search anytime.",
                    ["Start New Search", "Contact Agent"]
                );
                break;
        }
    };

    const performSearch = async (customSearchData) => {
        setIsSearching(true);
        const dataToUse = customSearchData || searchData;
        const baseUrl = `${import.meta.env.VITE_API_URL}/projects`;

        const requestBody = {
            page: 1, limit: 100,
            include_developer: true,
            category: "Off_plan" // Force OFF PLAN as main category
        };

        if (dataToUse.minPrice) requestBody.min_price = dataToUse.minPrice;
        if (dataToUse.maxPrice) requestBody.max_price = Math.min(dataToUse.maxPrice, 5000000);
        else requestBody.max_price = 5000000;

        if (dataToUse.developer && dataToUse.developer !== "Any Developer") {
            // Use developer name as search query works best with this specific API
            requestBody.search = dataToUse.developer;
        }

        addMessage("🔍 Searching our exclusive off-plan collection...", undefined, true);

        try {
            const response = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("API Error");
            const json = await response.json();

            let items = [];
            if (json.data && Array.isArray(json.data.data)) items = json.data.data;
            else if (json.data && Array.isArray(json.data)) items = json.data;

            // Filter logic if needed client side (API 'search' is broad)
            if (dataToUse.developer && dataToUse.developer !== "Any Developer") {
                items = items.filter(i => {
                    const devName = i.dev?.Company?.name || i.developer?.Company?.name || i.dev_name || "";
                    return devName.toLowerCase().includes(dataToUse.developer.toLowerCase());
                });
            }

            // Map to consistent format
            const results = items.map(item => ({
                id: item._id || item.id,
                title: item.title || item.name || "Property",
                price: item.price || item.min_price || 0,
                image: (item.cover_image && item.cover_image.startsWith('http')) ? item.cover_image : "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200",
                city: item.location_name || item.address || "Dubai"
            }));

            setTimeout(() => {
                if (results.length > 0) {
                    addMessage(
                        `🎉 I found ${results.length} properties matching your criteria! Here are some top picks:`,
                        ["Start New Search", "Contact Agent"],
                        false,
                        results.slice(0, 5)
                    );
                } else {
                    addMessage(
                        `I couldn't find any exact matches for those filters right now. 🤔\n\nTry broadening your search or selecting 'Any Developer'.`,
                        ["Start New Search", "Contact Agent"]
                    );
                }
                setIsSearching(false);
            }, 2000);

        } catch (err) {
            console.error(err);
            setTimeout(() => {
                addMessage("Checking connection... please try again.", ["Try Again"]);
                setIsSearching(false);
            }, 2000);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { id: Date.now(), sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        const userInput = input;
        setInput("");

        // Simple pass through to bot response logic
        setTimeout(() => handleBotResponse(userInput), 1000);
    };

    // Render Portal
    const ChatBotContent = () => {
        if (typeof window === 'undefined') return null;

        return createPortal(
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-end justify-end p-4 md:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-[10000] w-full max-w-md h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col pointer-events-auto"
                        >
                            {/* Header */}
                            <div className="bg-[#1A1F56] px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center">
                                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <h1 className="text-white font-semibold">SkyRan Assistant</h1>
                                </div>
                                <button onClick={handleClose} className="text-white/80 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[85%] ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}>
                                            {msg.sender === "bot" && (
                                                <div className="flex gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 p-1 flex-shrink-0">
                                                        <img src={logo} alt="Bot" className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-gray-800 text-sm shadow-sm whitespace-pre-wrap">
                                                            {msg.text}
                                                        </div>

                                                        {msg.options && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {msg.options.map(opt => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => handleOptionClick(opt)}
                                                                        className="px-3 py-1.5 bg-blue-50 text-[#1A1F56] text-xs font-medium rounded-full border border-blue-100 hover:bg-[#1A1F56] hover:text-white transition-colors"
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {msg.properties && msg.properties.length > 0 && (
                                                            <div className="grid gap-2">
                                                                {msg.properties.map(p => (
                                                                    <a
                                                                        key={p.id}
                                                                        href={`/properties/${p.id}`}
                                                                        target="_blank"
                                                                        className="block bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow flex gap-3 items-center group"
                                                                    >
                                                                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                                            <img src={p.image} className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div className="overflow-hidden">
                                                                            <h4 className="text-sm font-semibold truncate text-gray-800 group-hover:text-[#1A1F56]">{p.title}</h4>
                                                                            <p className="text-xs text-[#1A1F56] font-bold">AED {formatPrice(p.price)}</p>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {msg.isTyping && (
                                                            <div className="flex gap-1 items-center text-xs text-gray-400 pl-2">
                                                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                                                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
                                                                <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {msg.sender === "user" && (
                                                <div className="bg-[#1A1F56] text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-sm">
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                <input
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1A1F56] transition-colors"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-9 h-9 bg-[#1A1F56] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#2a3075] transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>,
            document.body
        );
    };

    return (
        <>
            {!externalIsOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 z-[9990] w-14 h-14 bg-[#1A1F56] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                >
                    <MessageCircle size={28} />
                </motion.button>
            )}
            <ChatBotContent />
        </>
    );
}
