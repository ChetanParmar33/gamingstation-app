import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 0,
  selectedPlanId: 'oneday',
  extraControllers: 0,
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    address: '',
    coordinates: null,
  },
  promoCode: '',
  discount: 0,
  totalAmount: 0,
  isPaid: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    selectPlan: (state, action) => {
      state.selectedPlanId = action.payload;
    },
    setExtraControllers: (state, action) => {
      state.extraControllers = action.payload;
    },
    updateCustomerInfo: (state, action) => {
      state.customerInfo = { ...state.customerInfo, ...action.payload };
    },
    applyPromoCode: (state, action) => {
      const { code, discount } = action.payload;
      state.promoCode = code;
      state.discount = discount;
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload;
    },
    markAsPaid: (state, action) => {
      state.isPaid = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setStep,
  selectPlan,
  setExtraControllers,
  updateCustomerInfo,
  applyPromoCode,
  setTotalAmount,
  markAsPaid,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
