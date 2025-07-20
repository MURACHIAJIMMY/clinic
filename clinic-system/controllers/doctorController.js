// 👩‍⚕️ Fetch all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ name: 1 });
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Server error retrieving doctors' });
  }
};

module.exports = { getAllDoctors };
