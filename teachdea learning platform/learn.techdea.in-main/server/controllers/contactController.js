import ContactMessage from "../models/ContactMessage.js";
import Notification from "../models/Notification.js";
import { sendWhatsAppContactNotification } from "../utils/whatsappService.js";

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Email, Subject, Message)."
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      subject: subject.trim(),
      message: message.trim(),
      status: "NEW"
    });

    // Create system notification for admins
    await Notification.create({
      title: `New Inquiry from ${contact.name}`,
      message: `${contact.subject}: ${contact.message.substring(0, 80)}...`,
      type: "inquiry",
      link: "/admin/contact"
    });

    // Send WhatsApp notification asynchronously
    const waResult = await sendWhatsAppContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message
    });

    if (waResult.success) {
      contact.whatsappSent = true;
      contact.whatsappMessageId = waResult.messageId || "";
      await contact.save();
    }

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! We have received your message and will respond shortly.",
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit contact message."
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && ["NEW", "READ", "REPLIED", "CLOSED"].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      ContactMessage.countDocuments(filter)
    ]);

    res.json({
      success: true,
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};

    if (status) {
      if (!["NEW", "READ", "REPLIED", "CLOSED"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
      update.status = status;
    }

    if (adminNotes !== undefined) {
      update.adminNotes = adminNotes;
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Contact inquiry not found" });
    }

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
