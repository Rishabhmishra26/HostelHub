/**
 * Hostel.ts
 * --------------------------------------------------------------
 * Reference data describing the 3 college hostels. Kept in the
 * database (instead of only in constants.ts) so an ADMIN can
 * edit hostel/floor/block/room information from the Admin Panel
 * without a developer touching code.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface IRoomUnit {
  roomNumber: string;
  capacity: number;
}

export interface IFloor {
  floorNumber: number;
  isMess: boolean;
  rooms: IRoomUnit[];
}

export interface IBlock {
  name: string; // "A" | "B" | "C" | "D"
  rooms: IRoomUnit[];
}

export interface IHostel extends mongoose.Document {
  name: string;
  type: "floor-based" | "block-based";
  totalFloors?: number;
  floors: IFloor[];
  blocks: IBlock[];
}

const RoomUnitSchema = new Schema<IRoomUnit>(
  { roomNumber: String, capacity: { type: Number, default: 5 } },
  { _id: false }
);

const FloorSchema = new Schema<IFloor>(
  {
    floorNumber: Number,
    isMess: { type: Boolean, default: false },
    rooms: { type: [RoomUnitSchema], default: [] },
  },
  { _id: false }
);

const BlockSchema = new Schema<IBlock>(
  { name: String, rooms: { type: [RoomUnitSchema], default: [] } },
  { _id: false }
);

const HostelSchema = new Schema<IHostel>(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["floor-based", "block-based"], required: true },
    totalFloors: { type: Number },
    floors: { type: [FloorSchema], default: [] },
    blocks: { type: [BlockSchema], default: [] },
  },
  { timestamps: true }
);

export default models.Hostel || model<IHostel>("Hostel", HostelSchema);
