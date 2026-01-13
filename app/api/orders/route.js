import connectDB from "../../../src/config/db";
import Order from "../../../src/models/Order";
import { NextResponse } from "next/server";

// GET: fetch all orders or a single order by id or orderNumber
export async function GET(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const orderNumber = url.searchParams.get('orderNumber');

    if (id) {
      const order = await Order.findById(id);
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json(order, { status: 200 });
    }

    if (orderNumber) {
      const order = await Order.findOne({ orderNumber });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json(order, { status: 200 });
    }

    // otherwise return recent orders (limit 100)
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Orders GET error', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: create a new order
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Basic validation
    const { tableNumber, customer, items, payment, status } = body;
    if (!customer || !customer.firstName || !customer.phone) {
      return NextResponse.json({ error: 'Missing customer info' }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must include items' }, { status: 400 });
    }

    // compute totalAmount from items if not provided
    const computedTotal = items.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 1)), 0);

    const orderNumber = body.orderNumber || `ORD-${Date.now()}`;

    const orderDoc = new Order({
      orderNumber,
      tableNumber: tableNumber || 0,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName || '',
        phone: customer.phone,
        email: customer.email || ''
      },
      items: items.map(i => ({ dishId: i.dishId || null, name: i.name, price: i.price, quantity: i.quantity || 1, notes: i.notes || '' })),
      totalAmount: body.totalAmount || computedTotal,
      status: status || 'in_preparation',
      payment: payment || {}
    });

    const saved = await orderDoc.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Orders POST error', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH: update an order by id (provide ?id=...)
export async function PATCH(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400 });

    const body = await request.json();
    // restrict allowed updates
    const allowed = ['status', 'payment', 'review', 'items', 'tableNumber', 'totalAmount'];
    const update = {};
    Object.keys(body).forEach((k) => { if (allowed.includes(k)) update[k] = body[k]; });

    const updated = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Orders PATCH error', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE: delete an order by id
export async function DELETE(request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400 });

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Orders DELETE error', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
