

const Doctor = require('../Models/doctorModel')

/**
 * GET /api/doctors
 * Returns all doctors with populated & flattened user fields,
 * strips any legacy "uploads/" prefix, and sorts by name.
 */
const getAllDoctors = async (req, res) => {
  try {
    // 1️⃣ Fetch all doctors and populate name/email from User
    const docs = await Doctor.find()
      .populate('userId', 'name email')
      .lean()

    // 2️⃣ Map & normalize profileImage (strip "uploads/" if present)
    const flat = docs.map(d => {
      const user = d.userId || {}
      const rawImg = d.profileImage || ''
      const filename = rawImg.replace(/^uploads\//, '')

      return {
        _id: d._id,
        name: user.name || 'Unnamed',
        email: user.email || '—',
        phone: d.phone || '—',
        gender: d.gender || 'Not specified',
        specialization: d.specialization || 'General',
        profileImage: filename
      }
    })

    // 3️⃣ Sort by name
    flat.sort((a, b) => a.name.localeCompare(b.name))

    // 4️⃣ Return
    return res.status(200).json(flat)
  } catch (err) {
    console.error('Error fetching doctors:', err)
    return res
      .status(500)
      .json({ message: 'Server error retrieving doctors' })
  }
}

module.exports = { getAllDoctors }
