import {isValidObjectId, Types} from 'mongoose';
import {CounterModel} from '../models/Counter.model';
import {MenuItemModel} from '../models/MenuItem.model';
import {OrderDocument, OrderModel, OrderStatus} from '../models/Order.model';

export const orderRepository = {
  /** Next order number: AMI-1001, AMI-1002, … (atomic, safe with many orders at once). */
  nextOrderNumber: async () => {
    const counter = await CounterModel.findOneAndUpdate(
      {_id: 'order'},
      {$inc: {seq: 1}},
      {upsert: true, new: true}
    ).lean();
    return `AMI-${1000 + (counter?.seq ?? 1)}`;
  },

  findMenuItems: (ids: string[]) =>
    MenuItemModel.find({_id: {$in: ids}})
      .select('name price deal isAvailable category')
      .lean()
      .exec(),

  create: (data: Partial<OrderDocument>) => OrderModel.create(data),

  findById: (id: string) => (isValidObjectId(id) ? OrderModel.findById(id).lean().exec() : Promise.resolve(null)),

  listForCustomer: (customerId: string) =>
    OrderModel.find({customer: new Types.ObjectId(customerId)}).sort({createdAt: -1}).limit(50).lean().exec(),

  list: (statuses: OrderStatus[] | null, limit = 100) =>
    OrderModel.find(statuses ? {status: {$in: statuses}} : {})
      .sort({createdAt: -1})
      .limit(limit)
      .lean()
      .exec(),

  countByStatus: () =>
    OrderModel.aggregate<{_id: OrderStatus; count: number}>([{$group: {_id: '$status', count: {$sum: 1}}}]).exec(),

  /** Changes status only if it is still `from` (two cashiers can't double-apply a change). */
  updateStatus: (id: string, from: OrderStatus, to: OrderStatus) =>
    OrderModel.findOneAndUpdate(
      {_id: id, status: from},
      {$set: {status: to}, $push: {statusHistory: {status: to, at: new Date()}}},
      {new: true}
    )
      .lean()
      .exec()
};
