import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL;


const initialState = {
    isLoading: false,
    addressList: [],
};

export const addNewAddress = createAsyncThunk(
    "/addresses/addNewAddress",
    async (formData) => {
        const response = await axios.post(
            `${baseURL}/api/shop/address/add`,
            formData
        );
        return response.data;
    }
);

export const fetchAllAddresses = createAsyncThunk(
    "/addresses/fetchAllAddresses",
    async (userId) => {
        const response = await axios.get(
            `${baseURL}/api/shop/address/get/${userId}`
        );
        return response.data;
    }
);

export const editAddress = createAsyncThunk(
    "/addresses/editAddress",
    async ({ userId, addressId, formData }) => {
        const response = await axios.put(
            `${baseURL}/api/shop/address/update/${userId}/${addressId}`,
            formData
        );
        return response.data;
    }
);

export const deleteAddress = createAsyncThunk(
    "/addresses/deleteAddress",
    async ({ userId, addressId }) => {
        const response = await axios.delete(
            `${baseURL}/api/shop/address/delete/${userId}/${addressId}`
        );
        return response.data;
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addNewAddress.pending, (state) => {
            state.isLoading = true
        }).addCase(addNewAddress.fulfilled, (state, action) => {
            state.isLoading = false
        }).addCase(addNewAddress.rejected, (state) => {
            state.isLoading = false
        }).addCase(fetchAllAddresses.pending, (state) => {
            state.isLoading = true
        }).addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false
            state.addressList = action.payload.data
        }).addCase(fetchAllAddresses.rejected, (state) => {
            state.isLoading = false
            state.addressList = []
        })
    },
});


export default addressSlice.reducer; 