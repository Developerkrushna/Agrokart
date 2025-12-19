import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha,
  Divider,
  Button,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  Refresh as RefreshIcon,
  ShoppingCart,
  Call as CallIcon
} from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

// Predefined responses in multiple languages
const chatResponses = {
  en: {
    greeting: "🌾 Hello! I'm AgriNet AI Assistant. How can I help you with fertilizers today?",
    quickReplies: ["Product Info", "Delivery", "Pricing", "Expert Advice"],
    responses: {
      "product info": "🌱 We offer premium fertilizers:\n• Urea (₹850) - High nitrogen for leafy growth\n• DAP (₹1200) - Phosphorus for root development\n• NPK 20:20:20 (₹1100) - Balanced nutrition\n• Organic Compost (₹450) - Natural soil enrichment\n• Potash (₹950) - Potassium for fruit quality\n• Zinc Sulphate (₹180) - Micronutrient supplement\n\nAll products are certified and tested for maximum crop yield! 🚜",
      "delivery": "🚚 Fast & Reliable Delivery:\n• 24-hour delivery across India\n• Free delivery on orders above ₹1000\n• Real-time tracking available\n• Safe packaging to prevent damage\n• Cash on delivery option available\n\nWe deliver to your doorstep! 📦",
      "pricing": "💰 Competitive Pricing with Great Offers:\n• Urea: ₹850 (was ₹950) - Save 11%\n• DAP: ₹1200 (was ₹1350) - Save 11%\n• NPK: ₹1100 (was ₹1200) - Save 8%\n• Organic: ₹450 (was ₹500) - Save 10%\n\n🎉 Special offers:\n• Bulk discounts available\n• Seasonal promotions\n• Loyalty rewards for regular customers",
      "support": "👨‍🌾 Expert Agricultural Support:\n• 24/7 helpline: 1800-XXX-XXXX\n• WhatsApp support available\n• Soil testing recommendations\n• Crop-specific fertilizer advice\n• Application timing guidance\n• Dosage calculations\n\nOur experts have 15+ years of experience! 🎓",
      "expert advice": "🌾 Agricultural Expert Tips:\n• Test your soil pH before fertilizer selection\n• Apply fertilizers during cool hours (early morning/evening)\n• Water immediately after application\n• Follow recommended dosage for best results\n• Mix organic and chemical fertilizers for balanced nutrition\n\nNeed specific advice for your crop? Ask me! 🌱",
      "default": "🤔 I understand you're asking about fertilizers. I can help with:\n• Product information and recommendations\n• Delivery and shipping details\n• Pricing and current offers\n• Expert agricultural advice\n• Technical support\n\nWhat would you like to know more about?"
    }
  },
  hi: {
    greeting: "🌾 नमस्ते! मैं AgriNet AI सहायक हूं। आज मैं उर्वरकों के बारे में आपकी कैसे मदद कर सकता हूं?",
    quickReplies: ["उत्पाद जानकारी", "डिलीवरी", "कीमत", "विशेषज्ञ सलाह"],
    responses: {
      "उत्पाद जानकारी": "🌱 हमारे प्रीमियम उर्वरक:\n• यूरिया (₹850) - पत्तियों की वृद्धि के लिए नाइट्रोजन\n• डीएपी (₹1200) - जड़ों के विकास के लिए फास्फोरस\n• एनपीके 20:20:20 (₹1100) - संतुलित पोषण\n• जैविक खाद (₹450) - प्राकृतिक मिट्टी संवर्धन\n• पोटाश (₹950) - फलों की गुणवत्ता के लिए\n• जिंक सल्फेट (₹180) - सूक्ष्म पोषक तत्व\n\nसभी उत्पाद प्रमाणित और परीक्षित हैं! 🚜",
      "डिलीवरी": "🚚 तेज़ और विश्वसनीय डिलीवरी:\n• पूरे भारत में 24 घंटे डिलीवरी\n• ₹1000 से अधिक ऑर्डर पर मुफ्त डिलीवरी\n• रियल-टाइम ट्रैकिंग उपलब्ध\n• सुरक्षित पैकेजिंग\n• कैश ऑन डिलीवरी उपलब्ध\n\nहम आपके दरवाजे तक पहुंचाते हैं! 📦",
      "कीमत": "💰 प्रतिस्पर्धी कीमतों पर बेहतरीन ऑफर:\n• यूरिया: ₹850 (था ₹950) - 11% बचत\n• डीएपी: ₹1200 (था ₹1350) - 11% बचत\n• एनपीके: ₹1100 (था ₹1200) - 8% बचत\n• जैविक: ₹450 (था ₹500) - 10% बचत\n\n🎉 विशेष ऑफर:\n• थोक छूट उपलब्ध\n• मौसमी प्रमोशन\n• नियमित ग्राहकों के लिए रिवार्ड",
      "सहायता": "👨‍🌾 विशेषज्ञ कृषि सहायता:\n• 24/7 हेल्पलाइन: 1800-XXX-XXXX\n• व्हाट्सऐप सपोर्ट उपलब्ध\n• मिट्टी परीक्षण सुझाव\n• फसल-विशिष्ट उर्वरक सलाह\n• प्रयोग का समय\n• मात्रा की गणना\n\nहमारे विशेषज्ञों का 15+ साल का अनुभव! 🎓",
      "विशेषज्ञ सलाह": "🌾 कृषि विशेषज्ञ सुझाव:\n• उर्वरक चुनने से पहले मिट्टी का pH टेस्ट करें\n• ठंडे समय (सुबह/शाम) में उर्वरक डालें\n• प्रयोग के तुरंत बाद पानी दें\n• बेहतर परिणाम के लिए सुझाई गई मात्रा का पालन करें\n• संतुलित पोषण के लिए जैविक और रासायनिक उर्वरक मिलाएं\n\nअपनी फसल के लिए विशिष्ट सलाह चाहिए? पूछें! 🌱",
      "default": "🤔 मैं समझता हूं कि आप उर्वरकों के बारे में पूछ रहे हैं। मैं इनमें मदद कर सकता हूं:\n• उत्पाद जानकारी और सुझाव\n• डिलीवरी और शिपिंग विवरण\n• कीमत और वर्तमान ऑफर\n• विशेषज्ञ कृषि सलाह\n• तकनीकी सहायता\n\nआप किस बारे में और जानना चाहेंगे?"
    }
  },
  mr: {
    greeting: "🌾 नमस्कार! मी कृषीदूत AI सहाय्यक आहे. आज मी खतांबद्दल तुमची कशी मदत करू शकतो?",
    quickReplies: ["उत्पादन माहिती", "डिलिव्हरी", "किंमत", "तज्ञ सल्ला"],
    responses: {
      "उत्पादन माहिती": "🌱 आमची प्रीमियम खते:\n• युरिया (₹८५०) - पानांच्या वाढीसाठी नायट्रोजन\n• डीएपी (₹१२००) - मुळांच्या विकासासाठी फॉस्फरस\n• एनपीके २०:२०:२० (₹११००) - संतुलित पोषण\n• सेंद्रिय खत (₹४५०) - नैसर्गिक मातीचे संवर्धन\n• पोटॅश (₹९५०) - फळांच्या गुणवत्तेसाठी\n• झिंक सल्फेट (₹१८०) - सूक्ष्म पोषक तत्व\n\nसर्व उत्पादने प्रमाणित आणि तपासलेली! 🚜",
      "डिलिव्हरी": "🚚 जलद आणि विश्वसनीय डिलिव्हरी:\n• संपूर्ण भारतात २४ तास डिलिव्हरी\n• ₹१००० पेक्षा जास्त ऑर्डरवर मोफत डिलिव्हरी\n• रिअल-टाइम ट्रॅकिंग उपलब्ध\n• सुरक्षित पॅकेजिंग\n• कॅश ऑन डिलिव्हरी उपलब्ध\n\nआम्ही तुमच्या दारापर्यंत पोहोचवतो! 📦",
      "किंमत": "💰 स्पर्धात्मक किंमतीत उत्तम ऑफर:\n• युरिया: ₹८५० (होती ₹९५०) - ११% बचत\n• डीएपी: ₹१२०० (होती ₹१३५०) - ११% बचत\n• एनपीके: ₹११०० (होती ₹१२००) - ८% बचत\n• सेंद्रिय: ₹४५० (होती ₹५००) - १०% बचत\n\n🎉 विशेष ऑफर:\n• मोठ्या प्रमाणात सूट उपलब्ध\n• हंगामी प्रमोशन\n• नियमित ग्राहकांसाठी रिवॉर्ड",
      "सहाय्य": "👨‍🌾 तज्ञ कृषी सहाय्य:\n• २४/७ हेल्पलाइन: १८००-XXX-XXXX\n• व्हाट्सअॅप सपोर्ट उपलब्ध\n• मातीची चाचणी सुचवणे\n• पीक-विशिष्ट खत सल्ला\n• वापराची वेळ\n• प्रमाणाची गणना\n\nआमच्या तज्ञांचा १५+ वर्षांचा अनुभव! 🎓",
      "तज्ञ सल्ला": "🌾 कृषी तज्ञ सुचवणे:\n• खत निवडण्यापूर्वी मातीचा pH तपासा\n• थंड वेळेत (सकाळ/संध्याकाळ) खत टाका\n• वापरानंतर लगेच पाणी द्या\n• चांगल्या परिणामासाठी सुचवलेल्या प्रमाणाचे पालन करा\n• संतुलित पोषणासाठी सेंद्रिय आणि रासायनिक खते मिसळा\n\nतुमच्या पिकासाठी विशिष्ट सल्ला हवा? विचारा! 🌱",
      "default": "🤔 मला समजते की तुम्ही खतांबद्दल विचारत आहात. मी यामध्ये मदत करू शकतो:\n• उत्पादन माहिती आणि सुचवणे\n• डिलिव्हरी आणि शिपिंग तपशील\n• किंमत आणि सध्याचे ऑफर\n• तज्ञ कृषी सल्ला\n• तांत्रिक सहाय्य\n\nतुम्हाला कशाबद्दल अधिक जाणून घ्यायचे आहे?"
    }
  }
};

const AIChatbot = () => {
  const theme = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(language || 'en');
  const [langMenuAnchor, setLangMenuAnchor] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Ensure chatLanguage is always valid
  const getCurrentLanguageData = useCallback(() => {
    return chatResponses[chatLanguage] || chatResponses['en'];
  }, [chatLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens for the first time
      const languageData = getCurrentLanguageData();
      const welcomeMessage = {
        id: Date.now(),
        text: languageData.greeting,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, chatLanguage, messages.length, getCurrentLanguageData]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText.toLowerCase());
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput) => {
    const languageData = getCurrentLanguageData();
    const responses = languageData.responses;
    const input = userInput.toLowerCase();

    // Enhanced keyword matching with multiple language support
    const keywords = {
      en: {
        product: ['product', 'fertilizer', 'urea', 'dap', 'npk', 'organic', 'potash', 'zinc'],
        delivery: ['delivery', 'shipping', 'fast', 'time', 'when', 'how long'],
        price: ['price', 'cost', 'cheap', 'expensive', 'discount', 'offer'],
        support: ['help', 'support', 'contact', 'expert', 'advice', 'problem'],
        greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening']
      },
      hi: {
        product: ['उत्पाद', 'खाद', 'यूरिया', 'डीएपी', 'एनपीके', 'जैविक', 'पोटाश'],
        delivery: ['डिलीवरी', 'भेजना', 'तेज़', 'समय', 'कब', 'कितना समय'],
        price: ['कीमत', 'दाम', 'सस्ता', 'महंगा', 'छूट', 'ऑफर'],
        support: ['मदद', 'सहायता', 'संपर्क', 'विशेषज्ञ', 'सलाह', 'समस्या'],
        greeting: ['नमस्ते', 'हैलो', 'हाय', 'सुप्रभात', 'शुभ संध्या']
      },
      mr: {
        product: ['उत्पादन', 'खत', 'युरिया', 'डीएपी', 'एनपीके', 'सेंद्रिय', 'पोटॅश'],
        delivery: ['डिलिव्हरी', 'पाठवणे', 'जलद', 'वेळ', 'केव्हा', 'किती वेळ'],
        price: ['किंमत', 'दर', 'स्वस्त', 'महाग', 'सूट', 'ऑफर'],
        support: ['मदत', 'सहाय्य', 'संपर्क', 'तज्ञ', 'सल्ला', 'समस्या'],
        greeting: ['नमस्कार', 'हॅलो', 'हाय', 'सुप्रभात', 'शुभ संध्या']
      }
    };

    // Check for category matches
    const currentKeywords = keywords[chatLanguage] || keywords.en;

    for (const [category, words] of Object.entries(currentKeywords)) {
      if (words.some(word => input.includes(word))) {
        if (category === 'greeting') {
          return languageData.greeting;
        }
        const responseKey = category === 'product' ? 'product info' :
                           category === 'price' ? 'pricing' : category;
        return responses[responseKey] || responses.default;
      }
    }

    // Fallback to simple keyword matching for backward compatibility
    for (const [key, response] of Object.entries(responses)) {
      if (key !== 'default' && input.includes(key)) {
        return response;
      }
    }

    return responses.default;
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const handleLanguageChange = (lang) => {
    setChatLanguage(lang);
    setLangMenuAnchor(null);
    
    // Add language change message
    const langNames = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };
    const changeMessage = {
      id: Date.now(),
      text: `Language changed to ${langNames[lang]} / भाषा बदली गई / भाषा बदलली`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, changeMessage]);
  };

  const handleClearChat = () => {
    setMessages([]);
    const languageData = getCurrentLanguageData();
    const welcomeMessage = {
      id: Date.now(),
      text: languageData.greeting,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <>
      {/* Chat Widget */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 80, // Moved higher to avoid profile icon
          right: 20,
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1
        }}
      >
        {/* Chat Window */}
        <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
          <Paper
            elevation={8}
            sx={{
              width: { xs: '90vw', sm: 380 },
              height: { xs: '70vh', sm: 500 },
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: '#fff',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha('#fff', 0.2),
                    color: '#fff',
                    width: 40,
                    height: 40
                  }}
                >
                  <BotIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    KrushiDoot AI
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Agricultural Assistant
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  sx={{ color: '#fff' }}
                  onClick={(e) => setLangMenuAnchor(e.currentTarget)}
                >
                  <LanguageIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: '#fff' }}
                  onClick={handleClearChat}
                >
                  <RefreshIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: '#fff' }}
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* Messages Area */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: alpha(theme.palette.grey[300], 0.3),
                },
                '&::-webkit-scrollbar-thumb': {
                  background: alpha(theme.palette.primary.main, 0.3),
                  borderRadius: '2px',
                },
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 1,
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: message.sender === 'user' 
                          ? theme.palette.secondary.main 
                          : message.sender === 'system'
                          ? theme.palette.info.main
                          : theme.palette.primary.main,
                        fontSize: '0.875rem'
                      }}
                    >
                      {message.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                    </Avatar>
                    
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.sender === 'user' 
                          ? theme.palette.secondary.main 
                          : message.sender === 'system'
                          ? theme.palette.info.light
                          : '#fff',
                        color: message.sender === 'user' ? '#fff' : 'text.primary',
                        border: message.sender !== 'user' ? `1px solid ${alpha(theme.palette.grey[300], 0.5)}` : 'none'
                      }}
                    >
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                    <BotIcon />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#fff',
                      border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        {chatLanguage === 'hi' ? 'टाइप कर रहा है...' :
                         chatLanguage === 'mr' ? 'टाइप करत आहे...' : 'Typing...'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map((dot) => (
                          <Box
                            key={dot}
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main,
                              animation: `pulse 1.4s ease-in-out ${dot * 0.2}s infinite`,
                              '@keyframes pulse': {
                                '0%, 80%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                                '40%': { opacity: 1, transform: 'scale(1)' }
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            {/* Quick Replies */}
            {messages.length <= 1 && (
              <Box sx={{ p: 2, pt: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {chatLanguage === 'hi' ? 'त्वरित उत्तर:' :
                   chatLanguage === 'mr' ? 'जलद उत्तरे:' : 'Quick replies:'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {getCurrentLanguageData().quickReplies.map((reply, index) => (
                    <Chip
                      key={index}
                      label={reply}
                      size="small"
                      onClick={() => handleQuickReply(reply)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'translateY(-1px)',
                          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Stack>

                {/* Additional Quick Actions */}
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {chatLanguage === 'hi' ? 'त्वरित कार्य:' :
                   chatLanguage === 'mr' ? 'जलद कृती:' : 'Quick actions:'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ShoppingCart />}
                    onClick={() => window.open('/products', '_blank')}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {chatLanguage === 'hi' ? 'उत्पाद देखें' :
                     chatLanguage === 'mr' ? 'उत्पादने पहा' : 'View Products'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CallIcon />}
                    onClick={() => window.open('tel:1800-XXX-XXXX')}
                    sx={{ fontSize: '0.75rem' }}
                  >
                    {chatLanguage === 'hi' ? 'कॉल करें' :
                     chatLanguage === 'mr' ? 'कॉल करा' : 'Call Now'}
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                bgcolor: alpha(theme.palette.grey[50], 0.5)
              }}
            >
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <TextField
                  ref={inputRef}
                  fullWidth
                  size="small"
                  placeholder={`Type your message... (${chatLanguage.toUpperCase()})`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#fff'
                    }
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark
                    },
                    '&:disabled': {
                      bgcolor: alpha(theme.palette.grey[400], 0.3)
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        </Slide>

        {/* Chat Button */}
        <Fade in={!isOpen}>
          <Badge
            badgeContent="AI"
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                minWidth: 16,
                height: 16,
                fontWeight: 600
              }
            }}
          >
            <Fab
              color="primary"
              onClick={() => setIsOpen(true)}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-4px',
                  left: '-4px',
                  right: '-4px',
                  bottom: '-4px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  opacity: 0.6,
                  animation: 'chatbotPulse 2s infinite',
                  zIndex: -1
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  right: '-8px',
                  bottom: '-8px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                  opacity: 0.3,
                  animation: 'chatbotPulse 2s infinite 0.5s',
                  zIndex: -2
                },
                '@keyframes chatbotPulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 0.6
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                    opacity: 0.3
                  },
                  '100%': {
                    transform: 'scale(1.2)',
                    opacity: 0
                  }
                }
              }}
            >
              <ChatIcon />
            </Fab>
          </Badge>
        </Fade>
      </Box>

      {/* Language Menu */}
      <Menu
        anchorEl={langMenuAnchor}
        open={Boolean(langMenuAnchor)}
        onClose={() => setLangMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 120
          }
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>
          🇺🇸 English
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('hi')}>
          🇮🇳 हिंदी
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('mr')}>
          🇮🇳 मराठी
        </MenuItem>
      </Menu>
    </>
  );
};

export default AIChatbot;
