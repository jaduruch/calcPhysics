import type { QuantityKind } from '../physics/units.ts';
export interface ResourceField { id: string; name: string; kind: QuantityKind; symbol: string }
export interface ResourceOutput extends ResourceField { formula: string; unit?: string | null }
export interface ResourceDefinition {
 id: string; topic: string; title: string; fields: readonly ResourceField[];
 rules: Readonly<Record<string,string>>; outputs: readonly ResourceOutput[];
 assumption: string; source: string; pages: readonly number[]; reference?: string | null;
}
export const resourceDefinitions: readonly ResourceDefinition[] = [
  {
    "id": "contact-pressure",
    "topic": "fluid-statics",
    "title": "Pressure and Force",
    "fields": [
      {
        "id": "p",
        "name": "pressure",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "F",
        "name": "normal force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "A",
        "name": "loaded area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "p": "\\frac{[[F]]}{[[A]]}",
      "F": "[[p]]\\cdot[[A]]",
      "A": "\\frac{[[F]]}{[[p]]}"
    },
    "assumption": "Uniform normal load over the specified area. Pressure is force per area; tangential force is excluded. One bar equals exactly 100000 Pa.",
    "source": "Physik1",
    "pages": [
      1,
      2
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "hydraulic-press",
    "topic": "fluid-statics",
    "title": "Hydraulic Press",
    "fields": [
      {
        "id": "F1",
        "name": "input force",
        "kind": "force",
        "symbol": "F_1"
      },
      {
        "id": "A1",
        "name": "input piston area",
        "kind": "area",
        "symbol": "A_1"
      },
      {
        "id": "F2",
        "name": "output force",
        "kind": "force",
        "symbol": "F_2"
      },
      {
        "id": "A2",
        "name": "output piston area",
        "kind": "area",
        "symbol": "A_2"
      }
    ],
    "rules": {
      "F1": "\\frac{[[F2]]\\cdot[[A1]]}{[[A2]]}",
      "A1": "\\frac{[[F1]]\\cdot[[A2]]}{[[F2]]}",
      "F2": "\\frac{[[F1]]\\cdot[[A2]]}{[[A1]]}",
      "A2": "\\frac{[[F2]]\\cdot[[A1]]}{[[F1]]}"
    },
    "assumption": "Steady ideal conditions; no pressure losses. Use consistent gauge pressures; this is not a hydraulic-system design or safety calculation. Pistons are at the same height; p = F₁/A₁ = F₂/A₂. Force amplification does not create energy.",
    "source": "Physik1",
    "pages": [
      2
    ],
    "outputs": [
      {
        "id": "p",
        "name": "common pressure",
        "kind": "pressure",
        "formula": "\\frac{[[F1]]}{[[A1]]}",
        "symbol": "p",
        "unit": null
      }
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-3-pascals-principle-and-hydraulics"
  },
  {
    "id": "hydrostatic-pressure",
    "topic": "fluid-statics",
    "title": "Hydrostatic Pressure",
    "fields": [
      {
        "id": "p",
        "name": "pressure increase",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "h",
        "name": "depth below surface",
        "kind": "length",
        "symbol": "h"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "p": "[[rho]]\\cdot[[g]]\\cdot[[h]]",
      "rho": "\\frac{[[p]]}{[[g]]\\cdot[[h]]}",
      "h": "\\frac{[[p]]}{[[rho]]\\cdot[[g]]}"
    },
    "assumption": "Static incompressible fluid of constant density and uniform gravity. The result is pressure relative to the free surface, not absolute pressure. Add the surface pressure separately.",
    "source": "Physik1",
    "pages": [
      2
    ],
    "outputs": [],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-2-measuring-pressure"
  },
  {
    "id": "mass-density",
    "topic": "fluid-statics",
    "title": "Mass, Density and Volume",
    "fields": [
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "rho",
        "name": "density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "V",
        "name": "volume",
        "kind": "volume",
        "symbol": "V"
      }
    ],
    "rules": {
      "m": "[[rho]]\\cdot[[V]]",
      "rho": "\\frac{[[m]]}{[[V]]}",
      "V": "\\frac{[[m]]}{[[rho]]}"
    },
    "assumption": "Homogeneous material with constant bulk density. Density depends on material and temperature; provide an appropriate value.",
    "source": "Physik1",
    "pages": [
      10
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "volume-flow",
    "topic": "fluid-flow",
    "title": "Transported Volume",
    "fields": [
      {
        "id": "V",
        "name": "transported volume",
        "kind": "volume",
        "symbol": "V"
      },
      {
        "id": "A",
        "name": "pipe cross-sectional area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "v",
        "name": "mean flow speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "V": "[[A]]\\cdot[[v]]\\cdot[[t]]",
      "A": "\\frac{[[V]]}{[[v]]\\cdot[[t]]}",
      "v": "\\frac{[[V]]}{[[A]]\\cdot[[t]]}",
      "t": "\\frac{[[V]]}{[[A]]\\cdot[[v]]}"
    },
    "assumption": "Constant cross-sectional area and steady mean speed. Volume is area times distance, with distance v·t. No changing storage or leakage.",
    "source": "Physik1",
    "pages": [
      4
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "continuity",
    "topic": "fluid-flow",
    "title": "Incompressible Continuity",
    "fields": [
      {
        "id": "A1",
        "name": "upstream area",
        "kind": "area",
        "symbol": "A_1"
      },
      {
        "id": "v1",
        "name": "upstream speed",
        "kind": "velocity",
        "symbol": "v_1"
      },
      {
        "id": "A2",
        "name": "downstream area",
        "kind": "area",
        "symbol": "A_2"
      },
      {
        "id": "v2",
        "name": "downstream speed",
        "kind": "velocity",
        "symbol": "v_2"
      }
    ],
    "rules": {
      "A1": "\\frac{[[A2]]\\cdot[[v2]]}{[[v1]]}",
      "v1": "\\frac{[[A2]]\\cdot[[v2]]}{[[A1]]}",
      "A2": "\\frac{[[A1]]\\cdot[[v1]]}{[[v2]]}",
      "v2": "\\frac{[[A1]]\\cdot[[v1]]}{[[A2]]}"
    },
    "assumption": "Steady incompressible flow with one inlet and one outlet, no leakage or storage. Equal volume flow rates imply A₁v₁ = A₂v₂. Speeds are magnitudes.",
    "source": "Physik1",
    "pages": [
      4
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "boyle-law",
    "topic": "ideal-gases",
    "title": "Boyle–Mariotte Law",
    "fields": [
      {
        "id": "p1",
        "name": "initial absolute pressure",
        "kind": "pressure",
        "symbol": "p_1"
      },
      {
        "id": "V1",
        "name": "initial volume",
        "kind": "volume",
        "symbol": "V_1"
      },
      {
        "id": "p2",
        "name": "final absolute pressure",
        "kind": "pressure",
        "symbol": "p_2"
      },
      {
        "id": "V2",
        "name": "final volume",
        "kind": "volume",
        "symbol": "V_2"
      }
    ],
    "rules": {
      "p1": "\\frac{[[p2]]\\cdot[[V2]]}{[[V1]]}",
      "V1": "\\frac{[[p2]]\\cdot[[V2]]}{[[p1]]}",
      "p2": "\\frac{[[p1]]\\cdot[[V1]]}{[[V2]]}",
      "V2": "\\frac{[[p1]]\\cdot[[V1]]}{[[p2]]}"
    },
    "assumption": "A fixed amount of ideal gas at constant absolute temperature. From pV = nRT with fixed n and T, p₁V₁ = p₂V₂. Use absolute pressure.",
    "source": "Physik1",
    "pages": [
      3
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "temperature-scales",
    "topic": "temperature",
    "title": "Temperature Scales",
    "fields": [
      {
        "id": "T",
        "name": "absolute temperature",
        "kind": "temperature",
        "symbol": "T"
      }
    ],
    "rules": {},
    "assumption": "Kelvin is absolute temperature; Celsius and Fahrenheit have offset origins. Zero kelvin is the lower domain boundary. Prefixes on °C and °F inputs are rejected; use a plain number. Temperature intervals are handled separately.",
    "source": "Physik1",
    "pages": [
      5,
      7
    ],
    "outputs": [
      {
        "id": "TC",
        "name": "Celsius temperature",
        "kind": "temperature",
        "formula": "\\left(\\frac{[[T]]}{\\mathrm{K}}-273.15\\right)\\,{}^\\circ\\mathrm{C}",
        "symbol": "t_C",
        "unit": "°C"
      },
      {
        "id": "TF",
        "name": "Fahrenheit temperature",
        "kind": "temperature",
        "formula": "\\left(\\frac{9}{5}\\cdot\\frac{[[T]]}{\\mathrm{K}}-459.67\\right)\\,{}^\\circ\\mathrm{F}",
        "symbol": "t_F",
        "unit": "°F"
      }
    ],
    "reference": null
  },
  {
    "id": "linear-expansion",
    "topic": "thermal-expansion",
    "title": "Linear Expansion",
    "fields": [
      {
        "id": "dl",
        "name": "size change",
        "kind": "length",
        "symbol": "\\Delta l"
      },
      {
        "id": "l0",
        "name": "initial size",
        "kind": "length",
        "symbol": "l_0"
      },
      {
        "id": "alpha",
        "name": "expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "dl": "[[l0]]\\cdot[[alpha]]\\cdot[[dT]]",
      "l0": "\\frac{[[dl]]}{[[alpha]]\\cdot[[dT]]}",
      "alpha": "\\frac{[[dl]]}{[[l0]]\\cdot[[dT]]}",
      "dT": "\\frac{[[dl]]}{[[l0]]\\cdot[[alpha]]}"
    },
    "assumption": "First-order expansion with constant coefficient over the temperature interval; the relative size change must be small. Negative changes describe contraction. For isotropic solids the area and volume coefficients are approximately 2α and 3α; for liquids β is the measured volume coefficient. The final size must stay positive.",
    "source": "Physik1",
    "pages": [
      6,
      7
    ],
    "outputs": [
      {
        "id": "final",
        "name": "final size",
        "kind": "length",
        "formula": "[[l0]]+[[dl]]",
        "symbol": "l_2",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "area-expansion",
    "topic": "thermal-expansion",
    "title": "Area Expansion",
    "fields": [
      {
        "id": "dA",
        "name": "size change",
        "kind": "area",
        "symbol": "\\Delta A"
      },
      {
        "id": "A0",
        "name": "initial size",
        "kind": "area",
        "symbol": "A_0"
      },
      {
        "id": "alpha",
        "name": "expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "dA": "2\\cdot[[A0]]\\cdot[[alpha]]\\cdot[[dT]]",
      "A0": "\\frac{[[dA]]}{2\\cdot[[alpha]]\\cdot[[dT]]}",
      "alpha": "\\frac{[[dA]]}{2\\cdot[[A0]]\\cdot[[dT]]}",
      "dT": "\\frac{[[dA]]}{2\\cdot[[A0]]\\cdot[[alpha]]}"
    },
    "assumption": "First-order expansion with constant coefficient over the temperature interval; the relative size change must be small. Negative changes describe contraction. For isotropic solids the area and volume coefficients are approximately 2α and 3α; for liquids β is the measured volume coefficient. The final size must stay positive.",
    "source": "Physik1",
    "pages": [
      6,
      7
    ],
    "outputs": [
      {
        "id": "final",
        "name": "final size",
        "kind": "area",
        "formula": "[[A0]]+[[dA]]",
        "symbol": "A_2",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "solid-volume-expansion",
    "topic": "thermal-expansion",
    "title": "Solid Volume Expansion",
    "fields": [
      {
        "id": "dV",
        "name": "size change",
        "kind": "volume",
        "symbol": "\\Delta V"
      },
      {
        "id": "V0",
        "name": "initial size",
        "kind": "volume",
        "symbol": "V_0"
      },
      {
        "id": "alpha",
        "name": "expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "dV": "3\\cdot[[V0]]\\cdot[[alpha]]\\cdot[[dT]]",
      "V0": "\\frac{[[dV]]}{3\\cdot[[alpha]]\\cdot[[dT]]}",
      "alpha": "\\frac{[[dV]]}{3\\cdot[[V0]]\\cdot[[dT]]}",
      "dT": "\\frac{[[dV]]}{3\\cdot[[V0]]\\cdot[[alpha]]}"
    },
    "assumption": "First-order expansion with constant coefficient over the temperature interval; the relative size change must be small. Negative changes describe contraction. For isotropic solids the area and volume coefficients are approximately 2α and 3α; for liquids β is the measured volume coefficient. The final size must stay positive.",
    "source": "Physik1",
    "pages": [
      6,
      7
    ],
    "outputs": [
      {
        "id": "final",
        "name": "final size",
        "kind": "volume",
        "formula": "[[V0]]+[[dV]]",
        "symbol": "V_2",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "liquid-volume-expansion",
    "topic": "thermal-expansion",
    "title": "Liquid Volume Expansion",
    "fields": [
      {
        "id": "dV",
        "name": "size change",
        "kind": "volume",
        "symbol": "\\Delta V"
      },
      {
        "id": "V0",
        "name": "initial size",
        "kind": "volume",
        "symbol": "V_0"
      },
      {
        "id": "beta",
        "name": "expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\beta"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "dV": "[[V0]]\\cdot[[beta]]\\cdot[[dT]]",
      "V0": "\\frac{[[dV]]}{[[beta]]\\cdot[[dT]]}",
      "beta": "\\frac{[[dV]]}{[[V0]]\\cdot[[dT]]}",
      "dT": "\\frac{[[dV]]}{[[V0]]\\cdot[[beta]]}"
    },
    "assumption": "First-order expansion with constant coefficient over the temperature interval; the relative size change must be small. Negative changes describe contraction. For isotropic solids the area and volume coefficients are approximately 2α and 3α; for liquids β is the measured volume coefficient. The final size must stay positive.",
    "source": "Physik1",
    "pages": [
      6,
      7
    ],
    "outputs": [
      {
        "id": "final",
        "name": "final size",
        "kind": "volume",
        "formula": "[[V0]]+[[dV]]",
        "symbol": "V_2",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "expanded-density",
    "topic": "thermal-expansion",
    "title": "Density after Volume Expansion",
    "fields": [
      {
        "id": "rho2",
        "name": "final density",
        "kind": "density",
        "symbol": "\\rho_2"
      },
      {
        "id": "rho1",
        "name": "initial density",
        "kind": "density",
        "symbol": "\\rho_1"
      },
      {
        "id": "beta",
        "name": "volume expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\beta"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "rho2": "\\frac{[[rho1]]}{1+[[beta]]\\cdot[[dT]]}",
      "rho1": "[[rho2]]\\cdot(1+[[beta]]\\cdot[[dT]])",
      "beta": "\\frac{[[rho1]]/[[rho2]]-1}{[[dT]]}",
      "dT": "\\frac{[[rho1]]/[[rho2]]-1}{[[beta]]}"
    },
    "assumption": "Fixed mass, homogeneous material and first-order volume expansion V₂ = V₁(1 + βΔT). Conservation of mass gives ρ₂ = ρ₁/(1 + βΔT). The volume factor must be positive.",
    "source": "Physik1",
    "pages": [
      6
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "heat-capacity",
    "topic": "heat-and-calorimetry",
    "title": "Heat Capacity",
    "fields": [
      {
        "id": "C",
        "name": "heat capacity",
        "kind": "heatCapacity",
        "symbol": "C"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "c",
        "name": "specific heat capacity",
        "kind": "specificHeat",
        "symbol": "c"
      }
    ],
    "rules": {
      "C": "[[m]]\\cdot[[c]]",
      "m": "\\frac{[[C]]}{[[c]]}",
      "c": "\\frac{[[C]]}{[[m]]}"
    },
    "assumption": "Uniform material with positive constant specific heat in the interval considered. Heat capacity is energy per temperature interval; specific heat capacity is heat capacity per unit mass.",
    "source": "Physik1",
    "pages": [
      8
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "sensible-heat",
    "topic": "heat-and-calorimetry",
    "title": "Sensible Heat",
    "fields": [
      {
        "id": "Q",
        "name": "heat transferred to body",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "c",
        "name": "specific heat capacity",
        "kind": "specificHeat",
        "symbol": "c"
      },
      {
        "id": "dT",
        "name": "temperature change",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "Q": "[[m]]\\cdot[[c]]\\cdot[[dT]]",
      "m": "\\frac{[[Q]]}{[[c]]\\cdot[[dT]]}",
      "c": "\\frac{[[Q]]}{[[m]]\\cdot[[dT]]}",
      "dT": "\\frac{[[Q]]}{[[m]]\\cdot[[c]]}"
    },
    "assumption": "No phase change; constant positive specific heat capacity. Positive heat flows into the body and raises its temperature, negative heat describes cooling. Derived by Q = CΔT and C = mc.",
    "source": "Physik1",
    "pages": [
      8,
      10
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "thermal-mixing",
    "topic": "heat-and-calorimetry",
    "title": "Thermal Mixing",
    "fields": [
      {
        "id": "m1",
        "name": "first mass",
        "kind": "mass",
        "symbol": "m_1"
      },
      {
        "id": "c1",
        "name": "first specific heat",
        "kind": "specificHeat",
        "symbol": "c_1"
      },
      {
        "id": "T1",
        "name": "first absolute temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "m2",
        "name": "second mass",
        "kind": "mass",
        "symbol": "m_2"
      },
      {
        "id": "c2",
        "name": "second specific heat",
        "kind": "specificHeat",
        "symbol": "c_2"
      },
      {
        "id": "T2",
        "name": "second absolute temperature",
        "kind": "temperature",
        "symbol": "T_2"
      }
    ],
    "rules": {},
    "assumption": "Two bodies equilibrate in an isolated system without phase change, chemical reaction, container heat capacity or heat loss. Constant positive heat capacities. Energy balance m₁c₁(Tm − T₁) + m₂c₂(Tm − T₂) = 0 gives a heat-capacity-weighted mean.",
    "source": "Physik1",
    "pages": [
      9
    ],
    "outputs": [
      {
        "id": "Tm",
        "name": "equilibrium temperature",
        "kind": "temperature",
        "formula": "\\frac{[[m1]]\\cdot[[c1]]\\cdot[[T1]]+[[m2]]\\cdot[[c2]]\\cdot[[T2]]}{[[m1]]\\cdot[[c1]]+[[m2]]\\cdot[[c2]]}",
        "symbol": "T_m",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "fuel-energy",
    "topic": "fuels-and-heating",
    "title": "Fuel Energy by Mass",
    "fields": [
      {
        "id": "Q",
        "name": "released heat",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "m",
        "name": "fuel mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "H",
        "name": "specific heating value",
        "kind": "specificEnergy",
        "symbol": "H"
      }
    ],
    "rules": {
      "Q": "[[m]]\\cdot[[H]]",
      "m": "\\frac{[[Q]]}{[[H]]}",
      "H": "\\frac{[[Q]]}{[[m]]}"
    },
    "assumption": "Complete combustion with a supplied mass-specific heating value. Use a consistent lower or higher heating value; they are not interchangeable. This is released energy, not useful heater output; losses and combustion chemistry are excluded.",
    "source": "Physik1",
    "pages": [
      10
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "fuel-volume",
    "topic": "fuels-and-heating",
    "title": "Fuel Energy by Volume",
    "fields": [
      {
        "id": "Q",
        "name": "released heat",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "rho",
        "name": "fuel density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "V",
        "name": "fuel volume",
        "kind": "volume",
        "symbol": "V"
      },
      {
        "id": "H",
        "name": "specific heating value",
        "kind": "specificEnergy",
        "symbol": "H"
      }
    ],
    "rules": {
      "Q": "[[rho]]\\cdot[[V]]\\cdot[[H]]",
      "rho": "\\frac{[[Q]]}{[[V]]\\cdot[[H]]}",
      "V": "\\frac{[[Q]]}{[[rho]]\\cdot[[H]]}",
      "H": "\\frac{[[Q]]}{[[rho]]\\cdot[[V]]}"
    },
    "assumption": "Combine m = ρV and Q = mH for homogeneous fuel at the supplied density. Heating value is per mass, not per volume. No heater-efficiency assumption.",
    "source": "Physik1",
    "pages": [
      10
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "thermal-resistance",
    "topic": "heat-transfer",
    "title": "Thermal Resistance",
    "fields": [
      {
        "id": "T1",
        "name": "side 1 temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "T2",
        "name": "side 2 temperature",
        "kind": "temperature",
        "symbol": "T_2"
      },
      {
        "id": "Rth",
        "name": "thermal resistance",
        "kind": "thermalResistance",
        "symbol": "R_{th}"
      }
    ],
    "rules": {},
    "assumption": "Steady heat flow through a lumped positive thermal resistance. P is positive from side 1 to side 2; negative P means reversed heat flow. ΔT = T₁ − T₂ and P = ΔT/Rth. Radiation, convection and temperature dependence must already be represented by the supplied resistance.",
    "source": "Physik1",
    "pages": [
      12
    ],
    "outputs": [
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "formula": "[[T1]]-[[T2]]",
        "symbol": "\\Delta T",
        "unit": null
      },
      {
        "id": "P",
        "name": "heat flow rate",
        "kind": "power",
        "formula": "\\frac{[[T1]]-[[T2]]}{[[Rth]]}",
        "symbol": "P",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "mirror-focus",
    "topic": "optical-imaging",
    "title": "Spherical Mirror Focus",
    "fields": [
      {
        "id": "r",
        "name": "signed curvature radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "f",
        "name": "signed focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "r": "2\\cdot[[f]]",
      "f": "\\frac{[[r]]}{2}"
    },
    "assumption": "Paraxial approximation for a spherical mirror. Positive focal length and radius denote a concave converging mirror; negative values denote a convex diverging mirror. For large apertures spherical aberration limits the single-focus approximation.",
    "source": "Physik2",
    "pages": [
      3
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "lens-power",
    "topic": "optical-imaging",
    "title": "Thin Lens Power",
    "fields": [
      {
        "id": "D",
        "name": "optical power",
        "kind": "opticalPower",
        "symbol": "D"
      },
      {
        "id": "f",
        "name": "signed focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "D": "\\frac{1}{[[f]]}",
      "f": "\\frac{1}{[[D]]}"
    },
    "assumption": "Thin lens in air in the paraxial limit. Positive power is converging, negative power diverging. Optical power is inverse focal length in metres (dioptres); zero power corresponds to an infinite focal length and is excluded from finite results.",
    "source": "Physik2",
    "pages": [
      8
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "optical-medium",
    "topic": "refraction",
    "title": "Refractive Index and Phase Speed",
    "fields": [
      {
        "id": "n",
        "name": "refractive index",
        "kind": "dimensionless",
        "symbol": "n"
      },
      {
        "id": "v",
        "name": "phase speed in medium",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "n": "\\frac{299792458\\,\\mathrm{m/s}}{[[v]]}",
      "v": "\\frac{299792458\\,\\mathrm{m/s}}{[[n]]}"
    },
    "assumption": "Positive real refractive index at one wavelength. n = c₀/v uses the exact vacuum speed c₀ = 299792458 m/s. The speed is phase speed, not automatically group or information velocity. Absorption and dispersion are not calculated.",
    "source": "Physik2",
    "pages": [
      4
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "parallel-plate",
    "topic": "parallel-plates",
    "title": "Parallel-Sided Plate",
    "fields": [
      {
        "id": "n",
        "name": "plate refractive index (air outside)",
        "kind": "dimensionless",
        "symbol": "n"
      },
      {
        "id": "d",
        "name": "plate thickness",
        "kind": "length",
        "symbol": "d"
      },
      {
        "id": "i",
        "name": "angle of incidence",
        "kind": "angle",
        "symbol": "\\theta_1"
      }
    ],
    "rules": {},
    "assumption": "Plane parallel transparent plate in air (n outside = 1), n ≥ 1, incidence measured from the normal. Two applications of Snell’s law leave the emerging ray parallel to the incident ray. The apparent thickness d/n is a near-normal viewing approximation; the lateral displacement is valid at the supplied angle.",
    "source": "Physik2",
    "pages": [
      6
    ],
    "outputs": [
      {
        "id": "r",
        "name": "angle within plate",
        "kind": "angle",
        "formula": "\\arcsin\\!\\left(\\frac{\\sin[[i]]}{[[n]]}\\right)",
        "symbol": "\\theta_2",
        "unit": null
      },
      {
        "id": "s",
        "name": "lateral displacement",
        "kind": "length",
        "formula": "\\frac{[[d]]\\cdot\\sin\\!\\left([[i]]-[[r]]\\right)}{\\cos[[r]]}",
        "symbol": "s",
        "unit": null
      },
      {
        "id": "apparent",
        "name": "near-normal apparent thickness",
        "kind": "length",
        "formula": "\\frac{[[d]]}{[[n]]}",
        "symbol": "d'",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "prism-deviation",
    "topic": "prisms",
    "title": "Prism Deviation",
    "fields": [
      {
        "id": "n",
        "name": "prism index (air outside)",
        "kind": "dimensionless",
        "symbol": "n"
      },
      {
        "id": "A",
        "name": "apex angle",
        "kind": "angle",
        "symbol": "A"
      },
      {
        "id": "i",
        "name": "first incidence angle",
        "kind": "angle",
        "symbol": "i"
      }
    ],
    "rules": {},
    "assumption": "Acute triangular prism in air, positive index n ≥ 1 and angles measured from the face normals. r₁ + r₂ = A and δ = i + e − A. Snell’s law is applied at both faces. Only rays meeting the second face in the stated orientation are included. A totally internally reflected exit has no emergence angle or total transmitted deviation. No dispersion calculation.",
    "source": "Physik2",
    "pages": [
      7
    ],
    "outputs": [
      {
        "id": "r1",
        "name": "first internal angle",
        "kind": "angle",
        "formula": "\\arcsin\\!\\left(\\frac{\\sin[[i]]}{[[n]]}\\right)",
        "symbol": "r_1",
        "unit": null
      },
      {
        "id": "r2",
        "name": "second internal angle",
        "kind": "angle",
        "formula": "[[A]]-[[r1]]",
        "symbol": "r_2",
        "unit": null
      },
      {
        "id": "e",
        "name": "emergence angle (if allowed)",
        "kind": "angle",
        "formula": "\\arcsin\\!\\left([[n]]\\cdot\\sin[[r2]]\\right)",
        "symbol": "e",
        "unit": null
      },
      {
        "id": "delta",
        "name": "total deviation (if transmitted)",
        "kind": "angle",
        "formula": "[[i]]+[[e]]-[[A]]",
        "symbol": "\\delta",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "wave-relation",
    "topic": "wave-propagation",
    "title": "Wave Speed, Frequency and Wavelength",
    "fields": [
      {
        "id": "v",
        "name": "wave speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "f",
        "name": "frequency",
        "kind": "frequency",
        "symbol": "f"
      },
      {
        "id": "lambda",
        "name": "wavelength",
        "kind": "length",
        "symbol": "\\lambda"
      }
    ],
    "rules": {
      "v": "[[f]]\\cdot[[lambda]]",
      "f": "\\frac{[[v]]}{[[lambda]]}",
      "lambda": "\\frac{[[v]]}{[[f]]}"
    },
    "assumption": "A periodic travelling wave in a uniform medium at the specified frequency. In one period T = 1/f a wavefront travels one wavelength, so v = fλ. For dispersive media this is phase speed at that frequency.",
    "source": "Physik2",
    "pages": [
      9,
      10
    ],
    "outputs": [
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "formula": "\\frac{1}{[[f]]}",
        "symbol": "T",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "string-speed",
    "topic": "sound-sources",
    "title": "Wave Speed on a String",
    "fields": [
      {
        "id": "v",
        "name": "transverse wave speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "F",
        "name": "tension",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "rho",
        "name": "material density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "A",
        "name": "cross-sectional area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "v": "\\sqrt{\\frac{[[F]]}{[[rho]]\\cdot[[A]]}}",
      "F": "[[rho]]\\cdot[[A]]\\cdot[[v]]^2",
      "rho": "\\frac{[[F]]}{[[A]]\\cdot[[v]]^2}",
      "A": "\\frac{[[F]]}{[[rho]]\\cdot[[v]]^2}"
    },
    "assumption": "Ideal uniform taut string, small transverse displacement and constant tension. Linear mass density μ = ρA. Flexural stiffness, damping and tension changes are excluded.",
    "source": "Physik2",
    "pages": [
      11
    ],
    "outputs": [],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/16-3-wave-speed-on-a-stretched-string"
  },
  {
    "id": "string-fundamental",
    "topic": "sound-sources",
    "title": "String Fundamental",
    "fields": [
      {
        "id": "f",
        "name": "fundamental frequency",
        "kind": "frequency",
        "symbol": "f"
      },
      {
        "id": "v",
        "name": "wave speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "L",
        "name": "vibrating length",
        "kind": "length",
        "symbol": "L"
      }
    ],
    "rules": {
      "f": "\\frac{[[v]]}{2\\cdot[[L]]}",
      "v": "2\\cdot[[L]]\\cdot[[f]]",
      "L": "\\frac{[[v]]}{2\\cdot[[f]]}"
    },
    "assumption": "Both ends of an ideal string are fixed, so the fundamental has λ = 2L. End corrections, damping and higher modes are excluded. The supplied wave speed belongs to the string or gas, as appropriate.",
    "source": "Physik2",
    "pages": [
      11
    ],
    "outputs": [],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance"
  },
  {
    "id": "open-pipe",
    "topic": "sound-sources",
    "title": "Open Pipe Fundamental",
    "fields": [
      {
        "id": "f",
        "name": "fundamental frequency",
        "kind": "frequency",
        "symbol": "f"
      },
      {
        "id": "v",
        "name": "wave speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "L",
        "name": "vibrating length",
        "kind": "length",
        "symbol": "L"
      }
    ],
    "rules": {
      "f": "\\frac{[[v]]}{2\\cdot[[L]]}",
      "v": "2\\cdot[[L]]\\cdot[[f]]",
      "L": "\\frac{[[v]]}{2\\cdot[[f]]}"
    },
    "assumption": "An ideal pipe open at both ends has displacement antinodes at both ends and fundamental λ = 2L. End corrections, damping and higher modes are excluded. The supplied wave speed belongs to the string or gas, as appropriate.",
    "source": "Physik2",
    "pages": [
      11
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "closed-pipe",
    "topic": "sound-sources",
    "title": "Closed Pipe Fundamental",
    "fields": [
      {
        "id": "f",
        "name": "fundamental frequency",
        "kind": "frequency",
        "symbol": "f"
      },
      {
        "id": "v",
        "name": "wave speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "L",
        "name": "vibrating length",
        "kind": "length",
        "symbol": "L"
      }
    ],
    "rules": {
      "f": "\\frac{[[v]]}{4\\cdot[[L]]}",
      "v": "4\\cdot[[L]]\\cdot[[f]]",
      "L": "\\frac{[[v]]}{4\\cdot[[f]]}"
    },
    "assumption": "An ideal pipe closed at one end has a displacement node at that end and an antinode at the open end; fundamental λ = 4L. End corrections, damping and higher modes are excluded. The supplied wave speed belongs to the string or gas, as appropriate.",
    "source": "Physik2",
    "pages": [
      11
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "acoustic-beats",
    "topic": "interference",
    "title": "Two-Tone Beats",
    "fields": [
      {
        "id": "f1",
        "name": "first frequency",
        "kind": "frequency",
        "symbol": "f_1"
      },
      {
        "id": "f2",
        "name": "second frequency",
        "kind": "frequency",
        "symbol": "f_2"
      }
    ],
    "rules": {},
    "assumption": "Superposition of two coherent sinusoidal tones of equal amplitude. The signed amplitude envelope oscillates at half the frequency difference, while the audible intensity maxima repeat at the full absolute difference. Equal frequencies give no beats. No prediction of perceived loudness.",
    "source": "Physik2",
    "pages": [
      11
    ],
    "outputs": [
      {
        "id": "carrier",
        "name": "mean frequency",
        "kind": "frequency",
        "formula": "\\frac{[[f1]]+[[f2]]}{2}",
        "symbol": "f_{mean}",
        "unit": null
      },
      {
        "id": "envelope",
        "name": "signed-envelope frequency",
        "kind": "frequency",
        "formula": "\\frac{|[[f1]]-[[f2]]|}{2}",
        "symbol": "f_{env}",
        "unit": null
      },
      {
        "id": "beat",
        "name": "beat repetition frequency",
        "kind": "frequency",
        "formula": "|[[f1]]-[[f2]]|",
        "symbol": "f_{beat}",
        "unit": null
      }
    ],
    "reference": null
  },
  {
    "id": "sound-pressure-level",
    "topic": "sound-levels",
    "title": "Sound Pressure Level",
    "fields": [
      {
        "id": "Lp",
        "name": "sound pressure level",
        "kind": "decibel",
        "symbol": "L_p"
      },
      {
        "id": "p",
        "name": "RMS sound pressure",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "p0",
        "name": "reference RMS pressure",
        "kind": "pressure",
        "symbol": "p_0"
      }
    ],
    "rules": {
      "Lp": "20\\cdot\\log_{10}\\!\\left(\\frac{[[p]]}{[[p0]]}\\right)",
      "p": "[[p0]]\\cdot10^{[[Lp]]/20}"
    },
    "assumption": "RMS pressure relative to the chosen reference. Default p₀ = 20 µPa is conventional for airborne sound. This is unweighted sound pressure level, not phon, perceived loudness, hearing-damage advice or a frequency weighting. Pressure must be positive; exact silence would have −∞ dB and is excluded.",
    "source": "Physik2",
    "pages": [
      13
    ],
    "outputs": [],
    "reference": null
  },
  {
    "id": "sound-intensity",
    "topic": "sound-levels",
    "title": "Sound Power and Intensity",
    "fields": [
      {
        "id": "P",
        "name": "sound power through area",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "I",
        "name": "uniform intensity",
        "kind": "intensity",
        "symbol": "I"
      },
      {
        "id": "A",
        "name": "normal area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "P": "[[I]]\\cdot[[A]]",
      "I": "\\frac{[[P]]}{[[A]]}",
      "A": "\\frac{[[P]]}{[[I]]}"
    },
    "assumption": "Uniform intensity through an area perpendicular to propagation. Sound power is the area integral of intensity; it reduces to P = IA under these assumptions. This is not a loudness or sound-pressure conversion.",
    "source": "Physik2",
    "pages": [
      13
    ],
    "outputs": [],
    "reference": null
  }
];
