import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const WorkflowContext = createContext();

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

// Define the complete workflow steps
const WORKFLOW_STEPS = {
  // User Journey
  LANDING: 'landing',
  BROWSE_PRODUCTS: 'browse_products',
  PRODUCT_DETAIL: 'product_detail',
  
  // Authentication Flow
  LOGIN_REQUIRED: 'login_required',
  PHONE_LOGIN: 'phone_login',
  EMAIL_LOGIN: 'email_login',
  OTP_VERIFICATION: 'otp_verification',
  REGISTRATION: 'registration',
  
  // Shopping Flow
  ADD_TO_CART: 'add_to_cart',
  CART_REVIEW: 'cart_review',
  DELIVERY_DETAILS: 'delivery_details',
  PAYMENT_METHOD: 'payment_method',
  PAYMENT_PROCESSING: 'payment_processing',
  ORDER_CONFIRMATION: 'order_confirmation',
  
  // Post-Order Flow
  ORDER_TRACKING: 'order_tracking',
  DELIVERY_IN_PROGRESS: 'delivery_in_progress',
  ORDER_DELIVERED: 'order_delivered',
  FEEDBACK_RATING: 'feedback_rating',
  
  // User Management
  PROFILE_MANAGEMENT: 'profile_management',
  ORDER_HISTORY: 'order_history',
  SUPPORT_CHAT: 'support_chat',
  
  // Admin Flow
  ADMIN_DASHBOARD: 'admin_dashboard',
  PRODUCT_MANAGEMENT: 'product_management',
  ORDER_MANAGEMENT: 'order_management',
  USER_MANAGEMENT: 'user_management'
};

// Define workflow transitions
const WORKFLOW_TRANSITIONS = {
  [WORKFLOW_STEPS.LANDING]: [
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.LOGIN_REQUIRED,
    WORKFLOW_STEPS.REGISTRATION
  ],
  [WORKFLOW_STEPS.BROWSE_PRODUCTS]: [
    WORKFLOW_STEPS.PRODUCT_DETAIL,
    WORKFLOW_STEPS.ADD_TO_CART,
    WORKFLOW_STEPS.LOGIN_REQUIRED
  ],
  [WORKFLOW_STEPS.PRODUCT_DETAIL]: [
    WORKFLOW_STEPS.ADD_TO_CART,
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.LOGIN_REQUIRED
  ],
  [WORKFLOW_STEPS.LOGIN_REQUIRED]: [
    WORKFLOW_STEPS.PHONE_LOGIN,
    WORKFLOW_STEPS.EMAIL_LOGIN,
    WORKFLOW_STEPS.REGISTRATION
  ],
  [WORKFLOW_STEPS.PHONE_LOGIN]: [
    WORKFLOW_STEPS.OTP_VERIFICATION,
    WORKFLOW_STEPS.EMAIL_LOGIN
  ],
  [WORKFLOW_STEPS.EMAIL_LOGIN]: [
    WORKFLOW_STEPS.CART_REVIEW,
    WORKFLOW_STEPS.BROWSE_PRODUCTS
  ],
  [WORKFLOW_STEPS.OTP_VERIFICATION]: [
    WORKFLOW_STEPS.CART_REVIEW,
    WORKFLOW_STEPS.BROWSE_PRODUCTS
  ],
  [WORKFLOW_STEPS.REGISTRATION]: [
    WORKFLOW_STEPS.OTP_VERIFICATION,
    WORKFLOW_STEPS.BROWSE_PRODUCTS
  ],
  [WORKFLOW_STEPS.ADD_TO_CART]: [
    WORKFLOW_STEPS.CART_REVIEW,
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.LOGIN_REQUIRED
  ],
  [WORKFLOW_STEPS.CART_REVIEW]: [
    WORKFLOW_STEPS.DELIVERY_DETAILS,
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.LOGIN_REQUIRED
  ],
  [WORKFLOW_STEPS.DELIVERY_DETAILS]: [
    WORKFLOW_STEPS.PAYMENT_METHOD,
    WORKFLOW_STEPS.CART_REVIEW
  ],
  [WORKFLOW_STEPS.PAYMENT_METHOD]: [
    WORKFLOW_STEPS.PAYMENT_PROCESSING,
    WORKFLOW_STEPS.DELIVERY_DETAILS
  ],
  [WORKFLOW_STEPS.PAYMENT_PROCESSING]: [
    WORKFLOW_STEPS.ORDER_CONFIRMATION
  ],
  [WORKFLOW_STEPS.ORDER_CONFIRMATION]: [
    WORKFLOW_STEPS.ORDER_TRACKING,
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.ORDER_HISTORY
  ],
  [WORKFLOW_STEPS.ORDER_TRACKING]: [
    WORKFLOW_STEPS.DELIVERY_IN_PROGRESS,
    WORKFLOW_STEPS.ORDER_HISTORY,
    WORKFLOW_STEPS.SUPPORT_CHAT
  ],
  [WORKFLOW_STEPS.DELIVERY_IN_PROGRESS]: [
    WORKFLOW_STEPS.ORDER_DELIVERED
  ],
  [WORKFLOW_STEPS.ORDER_DELIVERED]: [
    WORKFLOW_STEPS.FEEDBACK_RATING,
    WORKFLOW_STEPS.BROWSE_PRODUCTS
  ],
  [WORKFLOW_STEPS.FEEDBACK_RATING]: [
    WORKFLOW_STEPS.BROWSE_PRODUCTS,
    WORKFLOW_STEPS.ORDER_HISTORY
  ]
};

export const WorkflowProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.LANDING);
  const [workflowHistory, setWorkflowHistory] = useState([WORKFLOW_STEPS.LANDING]);
  const [workflowData, setWorkflowData] = useState({});

  const navigate = useNavigate();

  // Safely get auth context - it might not be available during initial render
  let user = null;
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    // useAuth not available yet, use defaults
    console.log('Auth context not available yet, using defaults');
  }

  // Safely get cart context
  let cartItems = [];
  try {
    const cart = useCart();
    cartItems = cart.cartItems || [];
  } catch (error) {
    // useCart not available yet, use defaults
    console.log('Cart context not available yet, using defaults');
  }

  // Auto-detect current step based on URL and app state
  useEffect(() => {
    const path = window.location.pathname;
    let detectedStep = WORKFLOW_STEPS.LANDING;

    // Map URL paths to workflow steps
    if (path === '/' || path === '/home') {
      detectedStep = WORKFLOW_STEPS.LANDING;
    } else if (path === '/products' || path.includes('/product/')) {
      detectedStep = path.includes('/product/') ? WORKFLOW_STEPS.PRODUCT_DETAIL : WORKFLOW_STEPS.BROWSE_PRODUCTS;
    } else if (path === '/login') {
      detectedStep = WORKFLOW_STEPS.LOGIN_REQUIRED;
    } else if (path === '/email-login') {
      detectedStep = WORKFLOW_STEPS.EMAIL_LOGIN;
    } else if (path === '/otp') {
      detectedStep = WORKFLOW_STEPS.OTP_VERIFICATION;
    } else if (path === '/register') {
      detectedStep = WORKFLOW_STEPS.REGISTRATION;
    } else if (path === '/cart') {
      detectedStep = WORKFLOW_STEPS.CART_REVIEW;
    } else if (path === '/delivery-details') {
      detectedStep = WORKFLOW_STEPS.DELIVERY_DETAILS;
    } else if (path === '/payment') {
      detectedStep = WORKFLOW_STEPS.PAYMENT_METHOD;
    } else if (path === '/order-confirmation') {
      detectedStep = WORKFLOW_STEPS.ORDER_CONFIRMATION;
    } else if (path === '/order-tracking') {
      detectedStep = WORKFLOW_STEPS.ORDER_TRACKING;
    } else if (path === '/my-orders') {
      detectedStep = WORKFLOW_STEPS.ORDER_HISTORY;
    } else if (path === '/profile') {
      detectedStep = WORKFLOW_STEPS.PROFILE_MANAGEMENT;
    }

    if (detectedStep !== currentStep) {
      setCurrentStep(detectedStep);
      setWorkflowHistory(prev => [...prev, detectedStep]);
    }
  }, [window.location.pathname, currentStep]);

  const transitionTo = (nextStep, data = {}) => {
    const allowedTransitions = WORKFLOW_TRANSITIONS[currentStep] || [];
    
    if (!allowedTransitions.includes(nextStep)) {
      console.warn(`Invalid transition from ${currentStep} to ${nextStep}`);
      return false;
    }

    // Update workflow state
    setCurrentStep(nextStep);
    setWorkflowHistory(prev => [...prev, nextStep]);
    setWorkflowData(prev => ({ ...prev, ...data }));

    // Navigate to appropriate route
    navigateToStep(nextStep);
    return true;
  };

  const navigateToStep = (step) => {
    const routeMap = {
      [WORKFLOW_STEPS.LANDING]: '/',
      [WORKFLOW_STEPS.BROWSE_PRODUCTS]: '/products',
      [WORKFLOW_STEPS.LOGIN_REQUIRED]: '/login',
      [WORKFLOW_STEPS.PHONE_LOGIN]: '/login',
      [WORKFLOW_STEPS.EMAIL_LOGIN]: '/email-login',
      [WORKFLOW_STEPS.OTP_VERIFICATION]: '/otp',
      [WORKFLOW_STEPS.REGISTRATION]: '/register',
      [WORKFLOW_STEPS.CART_REVIEW]: '/cart',
      [WORKFLOW_STEPS.DELIVERY_DETAILS]: '/delivery-details',
      [WORKFLOW_STEPS.PAYMENT_METHOD]: '/payment',
      [WORKFLOW_STEPS.ORDER_CONFIRMATION]: '/order-confirmation',
      [WORKFLOW_STEPS.ORDER_TRACKING]: '/order-tracking',
      [WORKFLOW_STEPS.ORDER_HISTORY]: '/my-orders',
      [WORKFLOW_STEPS.PROFILE_MANAGEMENT]: '/profile'
    };

    const route = routeMap[step];
    if (route) {
      navigate(route);
    }
  };

  const goBack = () => {
    if (workflowHistory.length > 1) {
      const previousStep = workflowHistory[workflowHistory.length - 2];
      setCurrentStep(previousStep);
      setWorkflowHistory(prev => prev.slice(0, -1));
      navigateToStep(previousStep);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep(WORKFLOW_STEPS.LANDING);
    setWorkflowHistory([WORKFLOW_STEPS.LANDING]);
    setWorkflowData({});
    navigate('/');
  };

  const getNextSteps = () => {
    return WORKFLOW_TRANSITIONS[currentStep] || [];
  };

  const canTransitionTo = (step) => {
    const allowedTransitions = WORKFLOW_TRANSITIONS[currentStep] || [];
    return allowedTransitions.includes(step);
  };

  const value = {
    currentStep,
    workflowHistory,
    workflowData,
    WORKFLOW_STEPS,
    transitionTo,
    goBack,
    resetWorkflow,
    getNextSteps,
    canTransitionTo,
    navigateToStep
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowProvider;
