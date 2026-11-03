/** Reference display data: BIPM SI Brochure, 9th ed., v4.01; NIST CODATA 2022.
 * Not a calculator conversion registry; numeric values here are display strings. */
export const baseUnits = [
  {
    "quantity": "Time",
    "symbol": "t",
    "name": "second",
    "unit": "s"
  },
  {
    "quantity": "Length",
    "symbol": "l",
    "name": "metre",
    "unit": "m"
  },
  {
    "quantity": "Mass",
    "symbol": "m",
    "name": "kilogram",
    "unit": "kg"
  },
  {
    "quantity": "Electric current",
    "symbol": "I",
    "name": "ampere",
    "unit": "A"
  },
  {
    "quantity": "Thermodynamic temperature",
    "symbol": "T",
    "name": "kelvin",
    "unit": "K"
  },
  {
    "quantity": "Amount of substance",
    "symbol": "n",
    "name": "mole",
    "unit": "mol"
  },
  {
    "quantity": "Luminous intensity",
    "symbol": "I_v",
    "name": "candela",
    "unit": "cd"
  }
] as const;
export const namedUnits = [
  {
    "quantity": "Plane angle",
    "name": "radian",
    "expression": "[\\theta] = \\mathrm{rad} = \\frac{\\mathrm{m}}{\\mathrm{m}} = 1"
  },
  {
    "quantity": "Solid angle",
    "name": "steradian",
    "expression": "[\\Omega] = \\mathrm{sr} = \\frac{\\mathrm{m}^2}{\\mathrm{m}^2} = 1"
  },
  {
    "quantity": "Frequency",
    "name": "hertz",
    "expression": "[f] = \\mathrm{Hz} = \\mathrm{s^{-1}}"
  },
  {
    "quantity": "Force",
    "name": "newton",
    "expression": "[F] = \\mathrm{N} = \\frac{\\mathrm{kg}\\,\\mathrm{m}}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Pressure, stress",
    "name": "pascal",
    "expression": "[p] = \\mathrm{Pa} = \\frac{\\mathrm{N}}{\\mathrm{m}^2} = \\frac{\\mathrm{kg}}{\\mathrm{m}\\,\\mathrm{s}^2}"
  },
  {
    "quantity": "Energy, work, heat",
    "name": "joule",
    "expression": "[E] = \\mathrm{J} = \\mathrm{N\\,m} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Power",
    "name": "watt",
    "expression": "[P] = \\mathrm{W} = \\frac{\\mathrm{J}}{\\mathrm{s}} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^3}"
  },
  {
    "quantity": "Electric charge",
    "name": "coulomb",
    "expression": "[Q] = \\mathrm{C} = \\mathrm{A\\,s}"
  },
  {
    "quantity": "Electric potential difference",
    "name": "volt",
    "expression": "[U] = \\mathrm{V} = \\frac{\\mathrm{W}}{\\mathrm{A}} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^3\\,\\mathrm{A}}"
  },
  {
    "quantity": "Capacitance",
    "name": "farad",
    "expression": "[C] = \\mathrm{F} = \\frac{\\mathrm{C}}{\\mathrm{V}} = \\frac{\\mathrm{s}^4\\,\\mathrm{A}^2}{\\mathrm{kg}\\,\\mathrm{m}^2}"
  },
  {
    "quantity": "Electric resistance",
    "name": "ohm",
    "expression": "[R] = \\Omega = \\frac{\\mathrm{V}}{\\mathrm{A}} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^3\\,\\mathrm{A}^2}"
  },
  {
    "quantity": "Electric conductance",
    "name": "siemens",
    "expression": "[G] = \\mathrm{S} = \\frac{\\mathrm{A}}{\\mathrm{V}} = \\frac{\\mathrm{s}^3\\,\\mathrm{A}^2}{\\mathrm{kg}\\,\\mathrm{m}^2}"
  },
  {
    "quantity": "Magnetic flux",
    "name": "weber",
    "expression": "[\\Phi] = \\mathrm{Wb} = \\mathrm{V\\,s} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^2\\,\\mathrm{A}}"
  },
  {
    "quantity": "Magnetic flux density",
    "name": "tesla",
    "expression": "[B] = \\mathrm{T} = \\frac{\\mathrm{Wb}}{\\mathrm{m}^2} = \\frac{\\mathrm{kg}}{\\mathrm{s}^2\\,\\mathrm{A}}"
  },
  {
    "quantity": "Inductance",
    "name": "henry",
    "expression": "[L] = \\mathrm{H} = \\frac{\\mathrm{Wb}}{\\mathrm{A}} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^2\\,\\mathrm{A}^2}"
  },
  {
    "quantity": "Celsius temperature",
    "name": "degree Celsius",
    "expression": "[t] = {}^\\circ\\mathrm{C}"
  },
  {
    "quantity": "Luminous flux",
    "name": "lumen",
    "expression": "[\\Phi_v] = \\mathrm{lm} = \\mathrm{cd\\,sr}"
  },
  {
    "quantity": "Illuminance",
    "name": "lux",
    "expression": "[E_v] = \\mathrm{lx} = \\frac{lm}{\\mathrm{m}^2} = \\frac{\\mathrm{cd}\\,\\mathrm{sr}}{\\mathrm{m}^2}"
  },
  {
    "quantity": "Activity of a radionuclide",
    "name": "becquerel",
    "expression": "[A] = \\mathrm{Bq} = \\mathrm{s^{-1}}"
  },
  {
    "quantity": "Absorbed dose",
    "name": "gray",
    "expression": "[D] = \\mathrm{Gy} = \\frac{\\mathrm{J}}{\\mathrm{kg}} = \\frac{\\mathrm{m}^2}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Dose equivalent",
    "name": "sievert",
    "expression": "[H] = \\mathrm{Sv} = \\frac{\\mathrm{J}}{\\mathrm{kg}} = \\frac{\\mathrm{m}^2}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Catalytic activity",
    "name": "katal",
    "expression": "[z] = \\mathrm{kat} = \\frac{\\mathrm{mol}}{\\mathrm{s}}"
  }
] as const;
export const commonUnits = [
  {
    "quantity": "Area",
    "expression": "[A] = \\mathrm{m^2}"
  },
  {
    "quantity": "Volume",
    "expression": "[V] = \\mathrm{m^3}"
  },
  {
    "quantity": "Velocity",
    "expression": "[v] = \\frac{\\mathrm{m}}{\\mathrm{s}}"
  },
  {
    "quantity": "Acceleration",
    "expression": "[a] = \\frac{\\mathrm{m}}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Density",
    "expression": "[\\rho] = \\frac{\\mathrm{kg}}{\\mathrm{m}^3}"
  },
  {
    "quantity": "Momentum",
    "expression": "[p] = \\mathrm{N\\,s} = \\frac{\\mathrm{kg}\\,\\mathrm{m}}{\\mathrm{s}}"
  },
  {
    "quantity": "Torque",
    "expression": "[M] = \\mathrm{N\\,m} = \\frac{\\mathrm{kg}\\,\\mathrm{m}^2}{\\mathrm{s}^2}"
  },
  {
    "quantity": "Dynamic viscosity",
    "expression": "[\\eta] = \\mathrm{Pa\\,s} = \\frac{\\mathrm{kg}}{\\mathrm{m}\\,\\mathrm{s}}"
  },
  {
    "quantity": "Specific heat capacity",
    "expression": "[c] = \\frac{\\mathrm{J}}{\\mathrm{kg}\\,\\mathrm{K}} = \\frac{\\mathrm{m}^2}{\\mathrm{s}^2\\,\\mathrm{K}}"
  },
  {
    "quantity": "Thermal conductivity",
    "expression": "[\\lambda] = \\frac{\\mathrm{W}}{\\mathrm{m}\\,\\mathrm{K}} = \\frac{\\mathrm{kg}\\,\\mathrm{m}}{\\mathrm{s}^3\\,\\mathrm{K}}"
  }
] as const;
export const physicalConstants = [
  {
    "name": "Caesium-133 hyperfine transition frequency",
    "expression": "\\Delta\\nu_{Cs} = 9\\,192\\,631\\,770\\;\\mathrm{Hz}",
    "note": "Exact; unperturbed ground-state transition."
  },
  {
    "name": "Speed of light in vacuum",
    "expression": "c = 299\\,792\\,458\\;\\mathrm{m\\,s^{-1}}",
    "note": "Exact."
  },
  {
    "name": "Planck constant",
    "expression": "h = 6.626\\,070\\,15 \\times 10^{-34}\\;\\mathrm{J\\,s}",
    "note": "Exact."
  },
  {
    "name": "Elementary charge",
    "expression": "e = 1.602\\,176\\,634 \\times 10^{-19}\\;\\mathrm{C}",
    "note": "Exact."
  },
  {
    "name": "Boltzmann constant",
    "expression": "k = 1.380\\,649 \\times 10^{-23}\\;\\mathrm{J\\,K^{-1}}",
    "note": "Exact."
  },
  {
    "name": "Avogadro constant",
    "expression": "N_A = 6.022\\,140\\,76 \\times 10^{23}\\;\\mathrm{mol^{-1}}",
    "note": "Exact."
  },
  {
    "name": "Luminous efficacy",
    "expression": "K_{cd} = 683\\;\\mathrm{lm\\,W^{-1}}",
    "note": "Exact; monochromatic radiation of frequency 540 × 10¹² Hz."
  },
  {
    "name": "Newtonian constant of gravitation",
    "expression": "G = 6.674\\,30(15) \\times 10^{-11}\\;\\mathrm{m^3\\,kg^{-1}\\,\\mathrm{s}^{-2}}",
    "note": "Measured; CODATA 2022."
  },
  {
    "name": "Electron mass",
    "expression": "m_e = 9.109\\,383\\,7139(28) \\times 10^{-31}\\;\\mathrm{kg}",
    "note": "Measured; CODATA 2022."
  },
  {
    "name": "Proton mass",
    "expression": "m_p = 1.672\\,621\\,925\\,95(52) \\times 10^{-27}\\;\\mathrm{kg}",
    "note": "Measured; CODATA 2022."
  },
  {
    "name": "Molar gas constant",
    "expression": "R = N_\\mathrm{A} k \\approx 8.314\\,462\\,618\\;\\mathrm{J\\,mol^{-1}\\,\\mathrm{K}^{-1}}",
    "note": "Exact product; displayed decimal rounded."
  }
] as const;
