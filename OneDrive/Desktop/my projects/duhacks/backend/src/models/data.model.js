import mongoose from "mongoose";

const donationDataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        donationDate: {
            type: Date
        },
        bloodGroupNeeded: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        location: {
            address: {
                type: String,
                required: true
            },
            coordinates: {
                latitude: {
                    type: Number,
                    required: true,
                    min: -90,
                    max: 90
                },
                longitude: {
                    type: Number,
                    required: true,
                    min: -180,
                    max: 180
                }
            }
        },
        urgency: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "medium"
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed", "cancelled"],
            default: "pending"
        },
        reason: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const DonationData = mongoose.model("DonationData", donationDataSchema);

export default DonationData;
