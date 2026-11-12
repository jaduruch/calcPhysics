import type { ResourceDefinition } from './resource-catalog.ts';
/** Relations from Formelbuch, Physics pp. 48–72. Coverage and corrections: docs/FORMULA_BOOK.md. */
export const formulaBookDefinitions: readonly ResourceDefinition[] = [
  {
    "id": "book-angular-motion",
    "topic": "rotation",
    "title": "Angular Displacement and Time",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "phi": "[[omega]]\\cdot[[t]]",
      "omega": "\\frac{[[phi]]}{[[t]]}",
      "t": "\\frac{[[phi]]}{[[omega]]}"
    },
    "outputs": [],
    "assumption": "Constant angular velocity, measured in radians; signed angular quantities are allowed.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-arc-length",
    "topic": "rotation",
    "title": "Arc Length",
    "fields": [
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      }
    ],
    "rules": {
      "s": "[[r]]\\cdot[[phi]]",
      "r": "\\frac{[[s]]}{[[phi]]}",
      "phi": "\\frac{[[s]]}{[[r]]}"
    },
    "outputs": [],
    "assumption": "Circular path with a fixed positive radius. Arc displacement and angle have the same orientation.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-revolutions",
    "topic": "rotation",
    "title": "Angle and Revolutions",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "N",
        "name": "number of revolutions",
        "kind": "dimensionless",
        "symbol": "N"
      }
    ],
    "rules": {
      "phi": "2\\pi\\cdot[[N]]",
      "N": "\\frac{[[phi]]}{2\\pi}"
    },
    "outputs": [],
    "assumption": "N may include fractional revolutions and an orientation sign.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-frequency",
    "topic": "rotation",
    "title": "Angular Velocity and Frequency",
    "fields": [
      {
        "id": "omega",
        "name": "angular speed",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "f",
        "name": "rotation frequency",
        "kind": "frequency",
        "symbol": "f"
      }
    ],
    "rules": {
      "omega": "2\\pi\\cdot[[f]]",
      "f": "\\frac{[[omega]]}{2\\pi}"
    },
    "outputs": [],
    "assumption": "Positive rotation frequency and angular speed.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-rotation-period",
    "topic": "rotation",
    "title": "Rotation Period",
    "fields": [
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "symbol": "T"
      },
      {
        "id": "f",
        "name": "rotation frequency",
        "kind": "frequency",
        "symbol": "f"
      }
    ],
    "rules": {
      "T": "\\frac{1}{[[f]]}",
      "f": "\\frac{1}{[[T]]}"
    },
    "outputs": [],
    "assumption": "One full revolution per period; stationary rotation has no finite period.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-rotation-count",
    "topic": "rotation",
    "title": "Revolution Count and Time",
    "fields": [
      {
        "id": "f",
        "name": "rotation frequency",
        "kind": "frequency",
        "symbol": "f"
      },
      {
        "id": "N",
        "name": "revolution count",
        "kind": "dimensionless",
        "symbol": "N"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "f": "\\frac{[[N]]}{[[t]]}",
      "N": "[[f]]\\cdot[[t]]",
      "t": "\\frac{[[N]]}{[[f]]}"
    },
    "outputs": [],
    "assumption": "Mean rotation frequency over the observation interval.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-tangential-speed",
    "topic": "rotation",
    "title": "Tangential Velocity",
    "fields": [
      {
        "id": "v",
        "name": "tangential velocity",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      }
    ],
    "rules": {
      "v": "[[omega]]\\cdot[[r]]",
      "omega": "\\frac{[[v]]}{[[r]]}",
      "r": "\\frac{[[v]]}{[[omega]]}"
    },
    "outputs": [],
    "assumption": "Rigid rotation about a fixed axis; velocity signs follow the rotation orientation.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-path",
    "topic": "rotation",
    "title": "Arc Displacement During Rotation",
    "fields": [
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "s": "[[omega]]\\cdot[[r]]\\cdot[[t]]",
      "omega": "\\frac{[[s]]}{[[r]]\\cdot[[t]]}",
      "r": "\\frac{[[s]]}{[[omega]]\\cdot[[t]]}",
      "t": "\\frac{[[s]]}{[[omega]]\\cdot[[r]]}"
    },
    "outputs": [],
    "assumption": "Constant angular velocity and positive fixed radius.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-velocity",
    "topic": "rotation",
    "title": "Angular Velocity Under Constant Acceleration",
    "fields": [
      {
        "id": "w0",
        "name": "initial angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_0"
      },
      {
        "id": "w1",
        "name": "final angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_1"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "w1": "[[w0]]+[[alpha]]\\cdot[[t]]",
      "w0": "[[w1]]-[[alpha]]\\cdot[[t]]",
      "alpha": "\\frac{[[w1]]-[[w0]]}{[[t]]}",
      "t": "\\frac{[[w1]]-[[w0]]}{[[alpha]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration, signed angular velocities.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-average",
    "topic": "rotation",
    "title": "Angular Displacement from Mean Velocity",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "w0",
        "name": "initial angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_0"
      },
      {
        "id": "w1",
        "name": "final angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_1"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "phi": "\\frac{[[w0]]+[[w1]]}{2}\\cdot[[t]]",
      "w0": "\\frac{2\\cdot[[phi]]}{[[t]]}-[[w1]]",
      "w1": "\\frac{2\\cdot[[phi]]}{[[t]]}-[[w0]]",
      "t": "\\frac{2\\cdot[[phi]]}{[[w0]]+[[w1]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration; the mean of the initial and final velocities gives the time average.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-displacement",
    "topic": "rotation",
    "title": "Angular Displacement Under Acceleration",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "w0",
        "name": "initial angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_0"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "phi": "[[w0]]\\cdot[[t]]+\\frac{[[alpha]]\\cdot[[t]]^2}{2}",
      "w0": "\\frac{[[phi]]}{[[t]]}-\\frac{[[alpha]]\\cdot[[t]]}{2}",
      "alpha": "\\frac{2\\cdot([[phi]]-[[w0]]\\cdot[[t]])}{[[t]]^2}",
      "t": "\\frac{-[[w0]]\\pm\\sqrt{[[w0]]^2+2\\cdot[[alpha]]\\cdot[[phi]]}}{[[alpha]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration. Setting initial angular velocity to zero gives the from-rest formulas. Both admissible times are returned; zero acceleration is treated as a linear equation.",
    "source": "Formelbuch",
    "pages": [
      50,
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-energy",
    "topic": "rotation",
    "title": "Angular Velocity and Displacement",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "w0",
        "name": "initial angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_0"
      },
      {
        "id": "w1",
        "name": "final angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega_1"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "w1": "\\pm\\sqrt{[[w0]]^2+2\\cdot[[alpha]]\\cdot[[phi]]}",
      "w0": "\\pm\\sqrt{[[w1]]^2-2\\cdot[[alpha]]\\cdot[[phi]]}",
      "phi": "\\frac{[[w1]]^2-[[w0]]^2}{2\\cdot[[alpha]]}",
      "alpha": "\\frac{[[w1]]^2-[[w0]]^2}{2\\cdot[[phi]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration; both possible angular-velocity signs are shown when no other constraint selects one. Setting the initial velocity to zero gives the from-rest relation.",
    "source": "Formelbuch",
    "pages": [
      50,
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-force",
    "topic": "dynamics",
    "title": "Newton’s Second Law",
    "fields": [
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "a",
        "name": "constant acceleration",
        "kind": "acceleration",
        "symbol": "a"
      }
    ],
    "rules": {
      "F": "[[m]]\\cdot[[a]]",
      "m": "\\frac{[[F]]}{[[a]]}",
      "a": "\\frac{[[F]]}{[[m]]}"
    },
    "outputs": [],
    "assumption": "Inertial frame, constant positive mass and collinear signed force and acceleration.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-weight",
    "topic": "dynamics",
    "title": "Weight",
    "fields": [
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "Fg": "[[m]]\\cdot[[g]]",
      "m": "\\frac{[[Fg]]}{[[g]]}",
      "g": "\\frac{[[Fg]]}{[[m]]}"
    },
    "outputs": [],
    "assumption": "Local gravitational acceleration is positive; weight is a magnitude.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-gravitation",
    "topic": "dynamics",
    "title": "Universal Gravitation",
    "fields": [
      {
        "id": "F",
        "name": "attractive force magnitude",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "m1",
        "name": "first mass",
        "kind": "mass",
        "symbol": "m_1"
      },
      {
        "id": "m2",
        "name": "second mass",
        "kind": "mass",
        "symbol": "m_2"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      }
    ],
    "rules": {
      "F": "\\frac{G\\cdot[[m1]]\\cdot[[m2]]}{[[r]]^{2}}",
      "m1": "\\frac{[[F]]\\cdot[[r]]^{2}}{G\\cdot[[m2]]}",
      "m2": "\\frac{[[F]]\\cdot[[r]]^{2}}{G\\cdot[[m1]]}",
      "r": "\\sqrt{\\frac{G\\cdot[[m1]]\\cdot[[m2]]}{[[F]]}}"
    },
    "outputs": [],
    "assumption": "Point masses or non-overlapping spherically symmetric bodies. r is centre-to-centre distance; G = 6.67430 × 10⁻¹¹ m³/(kg s²). G is a physical constant.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://www.nist.gov/how-do-you-measure-it/how-do-you-measure-strength-gravity"
  },
  {
    "id": "book-orthogonal-force",
    "topic": "dynamics",
    "title": "Orthogonal Force Resultant",
    "fields": [
      {
        "id": "R",
        "name": "resultant magnitude",
        "kind": "force",
        "symbol": "F_R"
      },
      {
        "id": "X",
        "name": "first perpendicular component magnitude",
        "kind": "force",
        "symbol": "F_A"
      },
      {
        "id": "Y",
        "name": "second perpendicular component magnitude",
        "kind": "force",
        "symbol": "F_B"
      }
    ],
    "rules": {
      "R": "\\sqrt{[[X]]^2+[[Y]]^2}",
      "X": "\\sqrt{[[R]]^2-[[Y]]^2}",
      "Y": "\\sqrt{[[R]]^2-[[X]]^2}"
    },
    "outputs": [],
    "assumption": "The two force components must be perpendicular. All fields are magnitudes, not signed components.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-kinetic-friction",
    "topic": "dynamics",
    "title": "Kinetic Friction",
    "fields": [
      {
        "id": "Fr",
        "name": "friction magnitude",
        "kind": "force",
        "symbol": "F_R"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "Fn",
        "name": "normal force magnitude",
        "kind": "force",
        "symbol": "F_N"
      }
    ],
    "rules": {
      "Fr": "[[mu]]\\cdot[[Fn]]",
      "mu": "\\frac{[[Fr]]}{[[Fn]]}",
      "Fn": "\\frac{[[Fr]]}{[[mu]]}"
    },
    "outputs": [],
    "assumption": "Already sliding contact; kinetic friction opposes relative motion. This relation does not determine the onset of sliding.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-friction-work",
    "topic": "work-energy",
    "title": "Energy Dissipated by Sliding Friction",
    "fields": [
      {
        "id": "W",
        "name": "dissipated energy",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "Fn",
        "name": "normal force magnitude",
        "kind": "force",
        "symbol": "F_N"
      },
      {
        "id": "s",
        "name": "sliding distance",
        "kind": "length",
        "symbol": "s"
      }
    ],
    "rules": {
      "W": "[[mu]]\\cdot[[Fn]]\\cdot[[s]]",
      "mu": "\\frac{[[W]]}{[[Fn]]\\cdot[[s]]}",
      "Fn": "\\frac{[[W]]}{[[mu]]\\cdot[[s]]}",
      "s": "\\frac{[[W]]}{[[mu]]\\cdot[[Fn]]}"
    },
    "outputs": [],
    "assumption": "Constant kinetic friction and normal force. W is the positive dissipated energy; frictional work on the body is −W. On a horizontal surface F_N = mg.",
    "source": "Formelbuch",
    "pages": [
      53,
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-work-force",
    "topic": "work-energy",
    "title": "Work of a Constant Force",
    "fields": [
      {
        "id": "W",
        "name": "work",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      }
    ],
    "rules": {
      "W": "[[F]]\\cdot[[s]]",
      "F": "\\frac{[[W]]}{[[s]]}",
      "s": "\\frac{[[W]]}{[[F]]}"
    },
    "outputs": [],
    "assumption": "The force component is along the displacement and remains constant. Signed values represent work done on or by the body.",
    "source": "Formelbuch",
    "pages": [
      54,
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-potential-energy",
    "topic": "work-energy",
    "title": "Gravitational Potential Energy",
    "fields": [
      {
        "id": "E",
        "name": "potential-energy change",
        "kind": "energy",
        "symbol": "\\Delta E_p"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "h",
        "name": "height",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "E": "[[m]]\\cdot[[g]]\\cdot[[h]]",
      "m": "\\frac{[[E]]}{[[g]]\\cdot[[h]]}",
      "g": "\\frac{[[E]]}{[[m]]\\cdot[[h]]}",
      "h": "\\frac{[[E]]}{[[m]]\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravitational field; h is the signed change in height, not an absolute potential reference.",
    "source": "Formelbuch",
    "pages": [
      54,
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-weight-energy",
    "topic": "work-energy",
    "title": "Potential Energy from Weight",
    "fields": [
      {
        "id": "E",
        "name": "potential-energy change",
        "kind": "energy",
        "symbol": "\\Delta E_p"
      },
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "h",
        "name": "height",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "E": "[[Fg]]\\cdot[[h]]",
      "Fg": "\\frac{[[E]]}{[[h]]}",
      "h": "\\frac{[[E]]}{[[Fg]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravitational field and a signed height change.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-kinetic-energy",
    "topic": "work-energy",
    "title": "Kinetic Energy",
    "fields": [
      {
        "id": "E",
        "name": "kinetic energy",
        "kind": "energy",
        "symbol": "E_k"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "E": "\\frac12\\cdot[[m]]\\cdot[[v]]^{2}",
      "m": "\\frac{[[E]]}{\\frac12\\cdot[[v]]^{2}}",
      "v": "\\sqrt{\\frac{[[E]]}{\\frac12\\cdot[[m]]}}"
    },
    "outputs": [],
    "assumption": "Nonrelativistic motion; v is speed, so the nonnegative square root is used.",
    "source": "Formelbuch",
    "pages": [
      54,
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-kinetic-weight",
    "topic": "work-energy",
    "title": "Kinetic Energy from Weight",
    "fields": [
      {
        "id": "E",
        "name": "kinetic energy",
        "kind": "energy",
        "symbol": "E_k"
      },
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "E": "\\frac{\\frac12\\cdot[[Fg]]\\cdot[[v]]^{2}}{[[g]]}",
      "Fg": "\\frac{[[E]]\\cdot[[g]]}{\\frac12\\cdot[[v]]^{2}}",
      "v": "\\sqrt{\\frac{[[E]]\\cdot[[g]]}{\\frac12\\cdot[[Fg]]}}",
      "g": "\\frac{\\frac12\\cdot[[Fg]]\\cdot[[v]]^{2}}{[[E]]}"
    },
    "outputs": [],
    "assumption": "Nonrelativistic speed magnitude and positive local gravitational acceleration.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-power-time",
    "topic": "work-energy",
    "title": "Work, Power and Time",
    "fields": [
      {
        "id": "W",
        "name": "work",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "W": "[[P]]\\cdot[[t]]",
      "P": "\\frac{[[W]]}{[[t]]}",
      "t": "\\frac{[[W]]}{[[P]]}"
    },
    "outputs": [],
    "assumption": "Mean power over the elapsed time; for variable power W is its time integral.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-mechanical-power",
    "topic": "work-energy",
    "title": "Translational Power",
    "fields": [
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "v",
        "name": "velocity along force",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "P": "[[F]]\\cdot[[v]]",
      "F": "\\frac{[[P]]}{[[v]]}",
      "v": "\\frac{[[P]]}{[[F]]}"
    },
    "outputs": [],
    "assumption": "Instantaneous power for collinear force and velocity. In general P is the scalar product of their vectors.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-rotational-power",
    "topic": "work-energy",
    "title": "Rotational Power",
    "fields": [
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "M",
        "name": "torque",
        "kind": "torque",
        "symbol": "M"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      }
    ],
    "rules": {
      "P": "[[M]]\\cdot[[omega]]",
      "M": "\\frac{[[P]]}{[[omega]]}",
      "omega": "\\frac{[[P]]}{[[M]]}"
    },
    "outputs": [],
    "assumption": "Torque and angular velocity about the same fixed axis; signed instantaneous power.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-electrical-power",
    "topic": "work-energy",
    "title": "Electrical Power",
    "fields": [
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "U",
        "name": "voltage",
        "kind": "voltage",
        "symbol": "U"
      },
      {
        "id": "I",
        "name": "current",
        "kind": "current",
        "symbol": "I"
      }
    ],
    "rules": {
      "P": "[[U]]\\cdot[[I]]",
      "U": "\\frac{[[P]]}{[[I]]}",
      "I": "\\frac{[[P]]}{[[U]]}"
    },
    "outputs": [],
    "assumption": "DC or instantaneous electrical power with the passive sign convention. AC RMS values require the power factor.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-acceleration-work",
    "topic": "work-energy",
    "title": "Work and Change in Kinetic Energy",
    "fields": [
      {
        "id": "W",
        "name": "work",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_1"
      },
      {
        "id": "v",
        "name": "final speed",
        "kind": "velocity",
        "symbol": "v_2"
      }
    ],
    "rules": {
      "W": "\\frac{[[m]]\\cdot([[v]]^2-[[v0]]^2)}{2}",
      "m": "\\frac{2\\cdot[[W]]}{[[v]]^2-[[v0]]^2}",
      "v": "\\sqrt{[[v0]]^2+\\frac{2\\cdot[[W]]}{[[m]]}}",
      "v0": "\\sqrt{[[v]]^2-\\frac{2\\cdot[[W]]}{[[m]]}}"
    },
    "outputs": [],
    "assumption": "Net work equals the change in nonrelativistic kinetic energy. Speeds are magnitudes; negative work represents braking.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-acceleration-distance-work",
    "topic": "work-energy",
    "title": "Work Under Constant Acceleration",
    "fields": [
      {
        "id": "W",
        "name": "work",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "a",
        "name": "constant acceleration",
        "kind": "acceleration",
        "symbol": "a"
      },
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      }
    ],
    "rules": {
      "W": "[[m]]\\cdot[[a]]\\cdot[[s]]",
      "m": "\\frac{[[W]]}{[[a]]\\cdot[[s]]}",
      "a": "\\frac{[[W]]}{[[m]]\\cdot[[s]]}",
      "s": "\\frac{[[W]]}{[[m]]\\cdot[[a]]}"
    },
    "outputs": [],
    "assumption": "Constant mass and collinear constant net acceleration; signed displacement and net work.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-pulley-force",
    "topic": "dynamics",
    "title": "Ideal Pulley Force",
    "fields": [
      {
        "id": "F",
        "name": "pulling force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "Fg",
        "name": "supported weight",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "n",
        "name": "supporting rope-segment count",
        "kind": "dimensionless",
        "symbol": "n"
      }
    ],
    "rules": {
      "F": "\\frac{[[Fg]]}{[[n]]}",
      "Fg": "[[F]]\\cdot[[n]]",
      "n": "\\frac{[[Fg]]}{[[F]]}"
    },
    "outputs": [],
    "assumption": "Ideal massless, frictionless pulley in quasistatic balance. n counts load-supporting rope segments, not necessarily pulleys: n = 1 for a fixed pulley, n = 2 for a single movable pulley.",
    "source": "Formelbuch",
    "pages": [
      55
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-pulley-distance",
    "topic": "dynamics",
    "title": "Ideal Pulley Travel",
    "fields": [
      {
        "id": "s",
        "name": "rope travel",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "n",
        "name": "supporting rope-segment count",
        "kind": "dimensionless",
        "symbol": "n"
      },
      {
        "id": "h",
        "name": "load rise",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "s": "[[n]]\\cdot[[h]]",
      "n": "\\frac{[[s]]}{[[h]]}",
      "h": "\\frac{[[s]]}{[[n]]}"
    },
    "outputs": [],
    "assumption": "Ideal inextensible rope. n = 1 covers a fixed pulley, n = 2 a single movable pulley. Energy is conserved: F s = F_G h.",
    "source": "Formelbuch",
    "pages": [
      55
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-combined-gas",
    "topic": "ideal-gases",
    "title": "Combined Gas Law",
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
        "id": "T1",
        "name": "initial absolute temperature",
        "kind": "temperature",
        "symbol": "T_1"
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
      },
      {
        "id": "T2",
        "name": "final absolute temperature",
        "kind": "temperature",
        "symbol": "T_2"
      }
    ],
    "rules": {
      "p1": "\\frac{[[T1]]\\cdot[[p2]]\\cdot[[V2]]}{[[V1]]\\cdot[[T2]]}",
      "V1": "\\frac{[[T1]]\\cdot[[p2]]\\cdot[[V2]]}{[[p1]]\\cdot[[T2]]}",
      "T1": "\\frac{[[p1]]\\cdot[[V1]]\\cdot[[T2]]}{[[p2]]\\cdot[[V2]]}",
      "p2": "\\frac{[[p1]]\\cdot[[V1]]\\cdot[[T2]]}{[[T1]]\\cdot[[V2]]}",
      "V2": "\\frac{[[p1]]\\cdot[[V1]]\\cdot[[T2]]}{[[T1]]\\cdot[[p2]]}",
      "T2": "\\frac{[[T1]]\\cdot[[p2]]\\cdot[[V2]]}{[[p1]]\\cdot[[V1]]}"
    },
    "outputs": [],
    "assumption": "Fixed amount of ideal gas in equilibrium; pressures are absolute and temperatures are kelvin.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas"
  },
  {
    "id": "book-isobaric-gas",
    "topic": "ideal-gases",
    "title": "Isobaric Gas Law",
    "fields": [
      {
        "id": "V1",
        "name": "initial volume",
        "kind": "volume",
        "symbol": "V_1"
      },
      {
        "id": "T1",
        "name": "initial absolute temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "V2",
        "name": "final volume",
        "kind": "volume",
        "symbol": "V_2"
      },
      {
        "id": "T2",
        "name": "final absolute temperature",
        "kind": "temperature",
        "symbol": "T_2"
      }
    ],
    "rules": {
      "V1": "\\frac{[[T1]]\\cdot[[V2]]}{[[T2]]}",
      "T1": "\\frac{[[V1]]\\cdot[[T2]]}{[[V2]]}",
      "V2": "\\frac{[[V1]]\\cdot[[T2]]}{[[T1]]}",
      "T2": "\\frac{[[T1]]\\cdot[[V2]]}{[[V1]]}"
    },
    "outputs": [],
    "assumption": "Fixed amount of ideal gas at constant positive absolute pressure.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas"
  },
  {
    "id": "book-isochoric-gas",
    "topic": "ideal-gases",
    "title": "Isochoric Gas Law",
    "fields": [
      {
        "id": "p1",
        "name": "initial absolute pressure",
        "kind": "pressure",
        "symbol": "p_1"
      },
      {
        "id": "T1",
        "name": "initial absolute temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "p2",
        "name": "final absolute pressure",
        "kind": "pressure",
        "symbol": "p_2"
      },
      {
        "id": "T2",
        "name": "final absolute temperature",
        "kind": "temperature",
        "symbol": "T_2"
      }
    ],
    "rules": {
      "p1": "\\frac{[[T1]]\\cdot[[p2]]}{[[T2]]}",
      "T1": "\\frac{[[p1]]\\cdot[[T2]]}{[[p2]]}",
      "p2": "\\frac{[[p1]]\\cdot[[T2]]}{[[T1]]}",
      "T2": "\\frac{[[T1]]\\cdot[[p2]]}{[[p1]]}"
    },
    "outputs": [],
    "assumption": "Fixed amount of ideal gas at constant volume. This is the pressure–temperature form of Gay–Lussac’s law.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas"
  },
  {
    "id": "book-mass-gas",
    "topic": "ideal-gases",
    "title": "Ideal Gas Law with Molar Mass",
    "fields": [
      {
        "id": "p",
        "name": "absolute pressure",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "V",
        "name": "gas volume",
        "kind": "volume",
        "symbol": "V"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "M",
        "name": "molar mass",
        "kind": "molarMass",
        "symbol": "M"
      },
      {
        "id": "T",
        "name": "absolute temperature",
        "kind": "temperature",
        "symbol": "T"
      }
    ],
    "rules": {
      "p": "\\frac{R\\cdot[[m]]\\cdot[[T]]}{[[V]]\\cdot[[M]]}",
      "V": "\\frac{R\\cdot[[m]]\\cdot[[T]]}{[[p]]\\cdot[[M]]}",
      "m": "\\frac{[[p]]\\cdot[[V]]\\cdot[[M]]}{R\\cdot[[T]]}",
      "M": "\\frac{R\\cdot[[m]]\\cdot[[T]]}{[[p]]\\cdot[[V]]}",
      "T": "\\frac{[[p]]\\cdot[[V]]\\cdot[[M]]}{R\\cdot[[m]]}"
    },
    "outputs": [],
    "assumption": "Ideal gas in equilibrium. R = 8.31446261815324 J/(mol K) is the universal gas constant; R/M is the specific gas constant. Absolute pressure and kelvin only.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas"
  },
  {
    "id": "book-surface-energy",
    "topic": "fluid-statics",
    "title": "Surface Energy",
    "fields": [
      {
        "id": "E",
        "name": "surface energy or reversible work",
        "kind": "energy",
        "symbol": "E"
      },
      {
        "id": "gamma",
        "name": "surface energy per area",
        "kind": "surfaceTension",
        "symbol": "\\gamma"
      },
      {
        "id": "A",
        "name": "new surface area",
        "kind": "area",
        "symbol": "\\Delta A"
      }
    ],
    "rules": {
      "E": "[[gamma]]\\cdot[[A]]",
      "gamma": "\\frac{[[E]]}{[[A]]}",
      "A": "\\frac{[[E]]}{[[gamma]]}"
    },
    "outputs": [],
    "assumption": "Constant surface energy density. A is the total new interface area; include both faces for a film when applicable. N/m and J/m² are equivalent units.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-surface-force",
    "topic": "fluid-statics",
    "title": "Surface Tension Force",
    "fields": [
      {
        "id": "F",
        "name": "surface force magnitude",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "gamma",
        "name": "surface tension",
        "kind": "surfaceTension",
        "symbol": "\\gamma"
      },
      {
        "id": "l",
        "name": "effective contact-line length",
        "kind": "length",
        "symbol": "L_F"
      }
    ],
    "rules": {
      "F": "[[gamma]]\\cdot[[l]]",
      "gamma": "\\frac{[[F]]}{[[l]]}",
      "l": "\\frac{[[F]]}{[[gamma]]}"
    },
    "outputs": [],
    "assumption": "Force component tangential to the interface. Effective line length includes all interfaces; contact-angle projections must already be included.",
    "source": "Formelbuch",
    "pages": [
      57
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-static-pressure",
    "topic": "fluid-statics",
    "title": "Static Pressure Contributions",
    "fields": [
      {
        "id": "p",
        "name": "total static gauge pressure",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "pk",
        "name": "piston pressure contribution",
        "kind": "pressure",
        "symbol": "p_K"
      },
      {
        "id": "ps",
        "name": "hydrostatic pressure contribution",
        "kind": "pressure",
        "symbol": "p_S"
      }
    ],
    "rules": {
      "p": "[[pk]]+[[ps]]",
      "pk": "[[p]]-[[ps]]",
      "ps": "[[p]]-[[pk]]"
    },
    "outputs": [],
    "assumption": "Both contributions use the same pressure reference. The hydrostatic contribution is positive for increasing depth.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-gauge-pressure",
    "topic": "fluid-statics",
    "title": "Gauge and Absolute Pressure",
    "fields": [
      {
        "id": "pg",
        "name": "gauge pressure",
        "kind": "pressure",
        "symbol": "p_g"
      },
      {
        "id": "pa",
        "name": "absolute pressure",
        "kind": "pressure",
        "symbol": "p_{abs}"
      },
      {
        "id": "pamb",
        "name": "ambient absolute pressure",
        "kind": "pressure",
        "symbol": "p_{amb}"
      }
    ],
    "rules": {
      "pg": "[[pa]]-[[pamb]]",
      "pa": "[[pg]]+[[pamb]]",
      "pamb": "[[pa]]-[[pg]]"
    },
    "outputs": [],
    "assumption": "Signed gauge pressure is absolute pressure minus ambient pressure. Negative gauge pressure indicates underpressure, not negative absolute pressure.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-underpressure",
    "topic": "fluid-statics",
    "title": "Underpressure Magnitude",
    "fields": [
      {
        "id": "pu",
        "name": "underpressure magnitude",
        "kind": "pressure",
        "symbol": "p_u"
      },
      {
        "id": "pa",
        "name": "absolute pressure",
        "kind": "pressure",
        "symbol": "p_{abs}"
      },
      {
        "id": "pamb",
        "name": "ambient absolute pressure",
        "kind": "pressure",
        "symbol": "p_{amb}"
      }
    ],
    "rules": {
      "pu": "[[pamb]]-[[pa]]",
      "pa": "[[pamb]]-[[pu]]",
      "pamb": "[[pa]]+[[pu]]"
    },
    "outputs": [],
    "assumption": "Applicable when absolute pressure is at most ambient pressure. The underpressure is a nonnegative magnitude.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-buoyancy",
    "topic": "fluid-statics",
    "title": "Buoyant Force",
    "fields": [
      {
        "id": "Fa",
        "name": "buoyant force magnitude",
        "kind": "force",
        "symbol": "F_A"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "V",
        "name": "displaced fluid volume",
        "kind": "volume",
        "symbol": "V"
      }
    ],
    "rules": {
      "Fa": "[[rho]]\\cdot[[g]]\\cdot[[V]]",
      "rho": "\\frac{[[Fa]]}{[[g]]\\cdot[[V]]}",
      "g": "\\frac{[[Fa]]}{[[rho]]\\cdot[[V]]}",
      "V": "\\frac{[[Fa]]}{[[rho]]\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Archimedes’ principle in a uniform fluid. Use displaced volume, not height: the source’s force formula omits the volume factor and is dimensionally incorrect.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-net-buoyancy",
    "topic": "fluid-statics",
    "title": "Net Buoyancy of a Fully Immersed Body",
    "fields": [
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "drho",
        "name": "fluid minus body density",
        "kind": "density",
        "symbol": "\\Delta\\rho"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "V",
        "name": "body volume",
        "kind": "volume",
        "symbol": "V"
      }
    ],
    "rules": {
      "F": "[[drho]]\\cdot[[g]]\\cdot[[V]]",
      "drho": "\\frac{[[F]]}{[[g]]\\cdot[[V]]}",
      "g": "\\frac{[[F]]}{[[drho]]\\cdot[[V]]}",
      "V": "\\frac{[[F]]}{[[drho]]\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Fully immersed body, uniform densities; upward force is positive. F = F_A − F_G = (ρ_fluid − ρ_body) g V. The source’s height factor is corrected to volume.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-volume-rate",
    "topic": "fluid-flow",
    "title": "Volume Flow Rate",
    "fields": [
      {
        "id": "q",
        "name": "volume flow rate",
        "kind": "volumeFlow",
        "symbol": "\\dot V"
      },
      {
        "id": "V",
        "name": "transported volume",
        "kind": "volume",
        "symbol": "V"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "q": "\\frac{[[V]]}{[[t]]}",
      "V": "[[q]]\\cdot[[t]]",
      "t": "\\frac{[[V]]}{[[q]]}"
    },
    "outputs": [],
    "assumption": "Mean volume flow over the observation interval.",
    "source": "Formelbuch",
    "pages": [
      59
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation"
  },
  {
    "id": "book-flow-speed",
    "topic": "fluid-flow",
    "title": "Flow Rate and Mean Speed",
    "fields": [
      {
        "id": "q",
        "name": "volume flow rate",
        "kind": "volumeFlow",
        "symbol": "\\dot V"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "q": "[[A]]\\cdot[[v]]",
      "A": "\\frac{[[q]]}{[[v]]}",
      "v": "\\frac{[[q]]}{[[A]]}"
    },
    "outputs": [],
    "assumption": "Cross-section-averaged normal flow speed through a fixed area.",
    "source": "Formelbuch",
    "pages": [
      59
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation"
  },
  {
    "id": "book-dynamic-pressure",
    "topic": "fluid-flow",
    "title": "Dynamic Pressure",
    "fields": [
      {
        "id": "p",
        "name": "dynamic pressure",
        "kind": "pressure",
        "symbol": "p_{dyn}"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "p": "\\frac12\\cdot[[rho]]\\cdot[[v]]^{2}",
      "rho": "\\frac{[[p]]}{\\frac12\\cdot[[v]]^{2}}",
      "v": "\\sqrt{\\frac{[[p]]}{\\frac12\\cdot[[rho]]}}"
    },
    "outputs": [],
    "assumption": "Incompressible flow; v is speed magnitude, not a signed velocity component.",
    "source": "Formelbuch",
    "pages": [
      59
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation"
  },
  {
    "id": "book-reynolds",
    "topic": "fluid-flow",
    "title": "Reynolds Number",
    "fields": [
      {
        "id": "Re",
        "name": "Reynolds number",
        "kind": "dimensionless",
        "symbol": "\\mathrm{Re}"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "l",
        "name": "characteristic length or diameter",
        "kind": "length",
        "symbol": "l"
      },
      {
        "id": "eta",
        "name": "dynamic viscosity",
        "kind": "viscosity",
        "symbol": "\\eta"
      }
    ],
    "rules": {
      "Re": "\\frac{[[rho]]\\cdot[[v]]\\cdot[[l]]}{[[eta]]}",
      "rho": "\\frac{[[Re]]\\cdot[[eta]]}{[[v]]\\cdot[[l]]}",
      "v": "\\frac{[[Re]]\\cdot[[eta]]}{[[rho]]\\cdot[[l]]}",
      "l": "\\frac{[[Re]]\\cdot[[eta]]}{[[rho]]\\cdot[[v]]}",
      "eta": "\\frac{[[rho]]\\cdot[[v]]\\cdot[[l]]}{[[Re]]}"
    },
    "outputs": [],
    "assumption": "Newtonian fluid with dynamic viscosity η. Choose the characteristic length for the geometry; no universal transition threshold is assumed.",
    "source": "Formelbuch",
    "pages": [
      60
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence"
  },
  {
    "id": "book-stokes-radius",
    "topic": "fluid-flow",
    "title": "Stokes Drag on a Sphere",
    "fields": [
      {
        "id": "F",
        "name": "drag magnitude",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "eta",
        "name": "dynamic viscosity",
        "kind": "viscosity",
        "symbol": "\\eta"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "F": "6\\pi\\cdot[[r]]\\cdot[[eta]]\\cdot[[v]]",
      "r": "\\frac{[[F]]}{6\\pi\\cdot[[eta]]\\cdot[[v]]}",
      "eta": "\\frac{[[F]]}{6\\pi\\cdot[[r]]\\cdot[[v]]}",
      "v": "\\frac{[[F]]}{6\\pi\\cdot[[r]]\\cdot[[eta]]}"
    },
    "outputs": [],
    "assumption": "Rigid sphere in creeping Newtonian flow (Re ≪ 1), far from walls. r = d/2. Drag opposes motion; F is its magnitude.",
    "source": "Formelbuch",
    "pages": [
      60
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence"
  },
  {
    "id": "book-stokes-diameter",
    "topic": "fluid-flow",
    "title": "Stokes Drag Using Diameter",
    "fields": [
      {
        "id": "F",
        "name": "drag magnitude",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "d",
        "name": "sphere diameter",
        "kind": "length",
        "symbol": "d"
      },
      {
        "id": "eta",
        "name": "dynamic viscosity",
        "kind": "viscosity",
        "symbol": "\\eta"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      }
    ],
    "rules": {
      "F": "3\\pi\\cdot[[d]]\\cdot[[eta]]\\cdot[[v]]",
      "d": "\\frac{[[F]]}{3\\pi\\cdot[[eta]]\\cdot[[v]]}",
      "eta": "\\frac{[[F]]}{3\\pi\\cdot[[d]]\\cdot[[v]]}",
      "v": "\\frac{[[F]]}{3\\pi\\cdot[[d]]\\cdot[[eta]]}"
    },
    "outputs": [],
    "assumption": "Same creeping-flow assumptions as the radius form; diameter is twice the radius.",
    "source": "Formelbuch",
    "pages": [
      60
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence"
  },
  {
    "id": "book-drag",
    "topic": "fluid-flow",
    "title": "Quadratic Drag",
    "fields": [
      {
        "id": "F",
        "name": "drag magnitude",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "Cd",
        "name": "drag coefficient",
        "kind": "dimensionless",
        "symbol": "c_w"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "F": "\\frac12\\cdot[[Cd]]\\cdot[[rho]]\\cdot[[v]]^{2}\\cdot[[A]]",
      "Cd": "\\frac{[[F]]}{\\frac12\\cdot[[rho]]\\cdot[[v]]^{2}\\cdot[[A]]}",
      "rho": "\\frac{[[F]]}{\\frac12\\cdot[[Cd]]\\cdot[[v]]^{2}\\cdot[[A]]}",
      "v": "\\sqrt{\\frac{[[F]]}{\\frac12\\cdot[[Cd]]\\cdot[[rho]]\\cdot[[A]]}}",
      "A": "\\frac{[[F]]}{\\frac12\\cdot[[Cd]]\\cdot[[rho]]\\cdot[[v]]^{2}}"
    },
    "outputs": [],
    "assumption": "Use the reference area associated with the drag coefficient and speed relative to the fluid. No automatic dependence of c_w on Reynolds number is assumed.",
    "source": "Formelbuch",
    "pages": [
      60
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence"
  },
  {
    "id": "book-poiseuille",
    "topic": "fluid-flow",
    "title": "Hagen–Poiseuille Flow",
    "fields": [
      {
        "id": "q",
        "name": "volume flow rate",
        "kind": "volumeFlow",
        "symbol": "\\dot V"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "dp",
        "name": "pressure drop",
        "kind": "pressure",
        "symbol": "\\Delta p"
      },
      {
        "id": "eta",
        "name": "dynamic viscosity",
        "kind": "viscosity",
        "symbol": "\\eta"
      },
      {
        "id": "l",
        "name": "pipe length",
        "kind": "length",
        "symbol": "l"
      }
    ],
    "rules": {
      "q": "\\frac{\\frac{\\pi}{8}\\cdot[[r]]^{4}\\cdot[[dp]]}{[[eta]]\\cdot[[l]]}",
      "r": "\\sqrt[4]{\\frac{[[q]]\\cdot[[eta]]\\cdot[[l]]}{\\frac{\\pi}{8}\\cdot[[dp]]}}",
      "dp": "\\frac{[[q]]\\cdot[[eta]]\\cdot[[l]]}{\\frac{\\pi}{8}\\cdot[[r]]^{4}}",
      "eta": "\\frac{\\frac{\\pi}{8}\\cdot[[r]]^{4}\\cdot[[dp]]}{[[q]]\\cdot[[l]]}",
      "l": "\\frac{\\frac{\\pi}{8}\\cdot[[r]]^{4}\\cdot[[dp]]}{[[q]]\\cdot[[eta]]}"
    },
    "outputs": [],
    "assumption": "Steady, fully developed laminar flow of an incompressible Newtonian fluid through a rigid circular pipe, with no slip. Radius is positive; the fourth root selects the physical radius.",
    "source": "Formelbuch",
    "pages": [
      60
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-7-viscosity-and-turbulence"
  },
  {
    "id": "book-luminous-flux",
    "topic": "photometry",
    "title": "Luminous Flux and Intensity",
    "fields": [
      {
        "id": "Phi",
        "name": "luminous flux",
        "kind": "luminousFlux",
        "symbol": "\\Phi_v"
      },
      {
        "id": "I",
        "name": "luminous intensity",
        "kind": "luminousIntensity",
        "symbol": "I_v"
      },
      {
        "id": "Omega",
        "name": "solid angle",
        "kind": "solidAngle",
        "symbol": "\\Omega"
      }
    ],
    "rules": {
      "Phi": "[[I]]\\cdot[[Omega]]",
      "I": "\\frac{[[Phi]]}{[[Omega]]}",
      "Omega": "\\frac{[[Phi]]}{[[I]]}"
    },
    "outputs": [],
    "assumption": "Uniform luminous intensity over the specified solid angle. The differential relation dΦ = I dΩ is the local form; total flux requires integration if intensity varies.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-luminous-energy",
    "topic": "photometry",
    "title": "Luminous Energy",
    "fields": [
      {
        "id": "Q",
        "name": "luminous energy",
        "kind": "luminousEnergy",
        "symbol": "Q_v"
      },
      {
        "id": "Phi",
        "name": "luminous flux",
        "kind": "luminousFlux",
        "symbol": "\\Phi_v"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "Q": "[[Phi]]\\cdot[[t]]",
      "Phi": "\\frac{[[Q]]}{[[t]]}",
      "t": "\\frac{[[Q]]}{[[Phi]]}"
    },
    "outputs": [],
    "assumption": "Time-independent luminous flux; otherwise Q is the time integral of flux. This is a photometric quantity in lumen seconds, not joules.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-illuminance-area",
    "topic": "photometry",
    "title": "Illuminance and Received Flux",
    "fields": [
      {
        "id": "E",
        "name": "illuminance",
        "kind": "illuminance",
        "symbol": "E"
      },
      {
        "id": "Phi",
        "name": "luminous flux",
        "kind": "luminousFlux",
        "symbol": "\\Phi_v"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "E": "\\frac{[[Phi]]}{[[A]]}",
      "Phi": "[[E]]\\cdot[[A]]",
      "A": "\\frac{[[Phi]]}{[[E]]}"
    },
    "outputs": [],
    "assumption": "Mean illuminance over the receiving area; locally E = dΦ/dA. Flux is received flux, not necessarily all emitted flux.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-inverse-square-light",
    "topic": "photometry",
    "title": "Inverse-Square Illuminance",
    "fields": [
      {
        "id": "E",
        "name": "illuminance",
        "kind": "illuminance",
        "symbol": "E"
      },
      {
        "id": "I",
        "name": "luminous intensity",
        "kind": "luminousIntensity",
        "symbol": "I_v"
      },
      {
        "id": "r",
        "name": "source-to-receiver distance",
        "kind": "length",
        "symbol": "r"
      }
    ],
    "rules": {
      "E": "\\frac{[[I]]}{[[r]]^{2}}",
      "I": "[[E]]\\cdot[[r]]^{2}",
      "r": "\\sqrt{\\frac{[[I]]}{[[E]]}}"
    },
    "outputs": [],
    "assumption": "Point source, normal incidence and no absorption. r is the source-to-receiver distance; I is intensity in that direction.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-oblique-illuminance",
    "topic": "photometry",
    "title": "Illuminance at Oblique Incidence",
    "fields": [
      {
        "id": "E",
        "name": "illuminance",
        "kind": "illuminance",
        "symbol": "E"
      },
      {
        "id": "I",
        "name": "luminous intensity",
        "kind": "luminousIntensity",
        "symbol": "I_v"
      },
      {
        "id": "r",
        "name": "source-to-receiver distance",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "alpha",
        "name": "angle from receiving-surface normal",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "E": "\\frac{[[I]]\\cdot\\cos[[alpha]]}{[[r]]^2}",
      "I": "\\frac{[[E]]\\cdot[[r]]^2}{\\cos[[alpha]]}",
      "r": "\\sqrt{\\frac{[[I]]\\cdot\\cos[[alpha]]}{[[E]]}}",
      "alpha": "\\arccos\\!\\left(\\frac{[[E]]\\cdot[[r]]^2}{[[I]]}\\right)"
    },
    "outputs": [],
    "assumption": "Point source, no absorption; α is measured from the surface normal, 0 ≤ α ≤ π/2. At grazing incidence the received illuminance is zero.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-light-distance-comparison",
    "topic": "photometry",
    "title": "Illuminance at Two Distances",
    "fields": [
      {
        "id": "E1",
        "name": "first illuminance",
        "kind": "illuminance",
        "symbol": "E_1"
      },
      {
        "id": "r1",
        "name": "first distance",
        "kind": "length",
        "symbol": "r_1"
      },
      {
        "id": "E2",
        "name": "second illuminance",
        "kind": "illuminance",
        "symbol": "E_2"
      },
      {
        "id": "r2",
        "name": "second distance",
        "kind": "length",
        "symbol": "r_2"
      }
    ],
    "rules": {
      "E1": "\\frac{[[E2]]\\cdot[[r2]]^{2}}{[[r1]]^{2}}",
      "r1": "\\sqrt{\\frac{[[E2]]\\cdot[[r2]]^{2}}{[[E1]]}}",
      "E2": "\\frac{[[E1]]\\cdot[[r1]]^{2}}{[[r2]]^{2}}",
      "r2": "\\sqrt{\\frac{[[E1]]\\cdot[[r1]]^{2}}{[[E2]]}}"
    },
    "outputs": [],
    "assumption": "The same point source and unchanged receiving orientation, without absorption.",
    "source": "Formelbuch",
    "pages": [
      62
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-luminance-area",
    "topic": "photometry",
    "title": "Luminance and Projected Area",
    "fields": [
      {
        "id": "L",
        "name": "luminance",
        "kind": "luminance",
        "symbol": "L"
      },
      {
        "id": "I",
        "name": "luminous intensity",
        "kind": "luminousIntensity",
        "symbol": "I_v"
      },
      {
        "id": "A",
        "name": "projected emitting area",
        "kind": "area",
        "symbol": "A_\\perp"
      }
    ],
    "rules": {
      "L": "\\frac{[[I]]}{[[A]]}",
      "I": "[[L]]\\cdot[[A]]",
      "A": "\\frac{[[I]]}{[[L]]}"
    },
    "outputs": [],
    "assumption": "Uniform luminance over the emitting area projected perpendicular to the viewing direction.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-luminance-solid",
    "topic": "photometry",
    "title": "Luminance and Illuminance",
    "fields": [
      {
        "id": "L",
        "name": "luminance",
        "kind": "luminance",
        "symbol": "L"
      },
      {
        "id": "E",
        "name": "illuminance",
        "kind": "illuminance",
        "symbol": "E"
      },
      {
        "id": "Omega",
        "name": "solid angle",
        "kind": "solidAngle",
        "symbol": "\\Omega"
      }
    ],
    "rules": {
      "L": "\\frac{[[E]]}{[[Omega]]}",
      "E": "[[L]]\\cdot[[Omega]]",
      "Omega": "\\frac{[[E]]}{[[L]]}"
    },
    "outputs": [],
    "assumption": "Uniform source luminance and paraxial or projected solid angle. For an extended oblique source, E = ∫ L cos θ dΩ; E/Ω is valid only with that projection included.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-solid-angle",
    "topic": "photometry",
    "title": "Solid Angle on a Sphere",
    "fields": [
      {
        "id": "Omega",
        "name": "solid angle",
        "kind": "solidAngle",
        "symbol": "\\Omega"
      },
      {
        "id": "A",
        "name": "area of spherical patch",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "r",
        "name": "sphere radius",
        "kind": "length",
        "symbol": "r"
      }
    ],
    "rules": {
      "Omega": "\\frac{[[A]]}{[[r]]^{2}}",
      "A": "[[Omega]]\\cdot[[r]]^{2}",
      "r": "\\sqrt{\\frac{[[A]]}{[[Omega]]}}"
    },
    "outputs": [],
    "assumption": "A is an area on a sphere centred on the observation point, not an arbitrary planar area. A full sphere has Ω = 4π sr; valid patches cannot exceed the full sphere.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://www.bipm.org/en/si-base-units/candela"
  },
  {
    "id": "book-thin-lens",
    "topic": "optical-imaging",
    "title": "Thin-Lens Imaging Equation",
    "fields": [
      {
        "id": "f",
        "name": "signed focal length",
        "kind": "length",
        "symbol": "f"
      },
      {
        "id": "g",
        "name": "object distance",
        "kind": "length",
        "symbol": "g"
      },
      {
        "id": "b",
        "name": "signed image distance",
        "kind": "length",
        "symbol": "b"
      }
    ],
    "rules": {
      "f": "\\frac{[[g]]\\cdot[[b]]}{[[g]]+[[b]]}",
      "g": "\\frac{[[f]]\\cdot[[b]]}{[[b]]-[[f]]}",
      "b": "\\frac{[[f]]\\cdot[[g]]}{[[g]]-[[f]]}"
    },
    "outputs": [],
    "assumption": "Thin lens in air, paraxial rays and a real object (g > 0). Positive b is a real image, negative b a virtual image; positive f is converging. Infinite image distance at g = f is not a finite result.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-image-magnification",
    "topic": "optical-imaging",
    "title": "Transverse Magnification",
    "fields": [
      {
        "id": "mag",
        "name": "signed transverse magnification",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "object distance",
        "kind": "length",
        "symbol": "g"
      },
      {
        "id": "b",
        "name": "signed image distance",
        "kind": "length",
        "symbol": "b"
      }
    ],
    "rules": {
      "mag": "\\frac{-1\\cdot[[b]]}{[[g]]}",
      "g": "\\frac{-1\\cdot[[b]]}{[[mag]]}",
      "b": "\\frac{[[mag]]\\cdot[[g]]}{-1}"
    },
    "outputs": [],
    "assumption": "Signed convention: m = −b/g; an inverted real image has negative magnification. The source uses positive image-size magnitudes for this case.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-image-size",
    "topic": "optical-imaging",
    "title": "Image and Object Size",
    "fields": [
      {
        "id": "mag",
        "name": "signed transverse magnification",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "B",
        "name": "signed image height",
        "kind": "length",
        "symbol": "B"
      },
      {
        "id": "G",
        "name": "object height",
        "kind": "length",
        "symbol": "G"
      }
    ],
    "rules": {
      "mag": "\\frac{[[B]]}{[[G]]}",
      "B": "[[mag]]\\cdot[[G]]",
      "G": "\\frac{[[B]]}{[[mag]]}"
    },
    "outputs": [],
    "assumption": "Image and object heights use the same transverse orientation. Negative magnification denotes inversion; use absolute values to recover the source’s size-magnitude formulas.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-real-image-ratio",
    "topic": "optical-imaging",
    "title": "Real-Image Size Ratio",
    "fields": [
      {
        "id": "B",
        "name": "image-size magnitude",
        "kind": "length",
        "symbol": "B"
      },
      {
        "id": "G",
        "name": "object-size magnitude",
        "kind": "length",
        "symbol": "G"
      },
      {
        "id": "b",
        "name": "real image distance",
        "kind": "length",
        "symbol": "b"
      },
      {
        "id": "g",
        "name": "object distance",
        "kind": "length",
        "symbol": "g"
      }
    ],
    "rules": {
      "B": "\\frac{[[G]]\\cdot[[b]]}{[[g]]}",
      "G": "\\frac{[[B]]\\cdot[[g]]}{[[b]]}",
      "b": "\\frac{[[B]]\\cdot[[g]]}{[[G]]}",
      "g": "\\frac{[[G]]\\cdot[[b]]}{[[B]]}"
    },
    "outputs": [],
    "assumption": "Real object and real inverted image. B and G are positive size magnitudes, so B/G = b/g. Use the signed magnification cards for virtual or upright images.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-image-extension",
    "topic": "optical-imaging",
    "title": "Lens Extension",
    "fields": [
      {
        "id": "ext",
        "name": "extension beyond the focal plane",
        "kind": "length",
        "symbol": "ext"
      },
      {
        "id": "b",
        "name": "real image distance",
        "kind": "length",
        "symbol": "b"
      },
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "ext": "[[b]]-[[f]]",
      "b": "[[ext]]+[[f]]",
      "f": "[[b]]-[[ext]]"
    },
    "outputs": [],
    "assumption": "Converging thin lens with a real image and b ≥ f. Extension is b − f; a zero extension corresponds to an object at infinity.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-extension-magnification",
    "topic": "optical-imaging",
    "title": "Magnification from Lens Extension",
    "fields": [
      {
        "id": "mag",
        "name": "real-image magnification magnitude",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "ext",
        "name": "lens extension",
        "kind": "length",
        "symbol": "ext"
      },
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "mag": "\\frac{[[ext]]}{[[f]]}",
      "ext": "[[mag]]\\cdot[[f]]",
      "f": "\\frac{[[ext]]}{[[mag]]}"
    },
    "outputs": [],
    "assumption": "Converging thin lens and real-image size magnitudes: m = ext/f = (b−f)/f = b/f−1 = f/(g−f). These equalities assume the thin-lens equation.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-bellows-factor",
    "topic": "optical-imaging",
    "title": "Bellows Exposure Factor",
    "fields": [
      {
        "id": "V",
        "name": "exposure extension factor",
        "kind": "dimensionless",
        "symbol": "V"
      },
      {
        "id": "ext",
        "name": "lens extension",
        "kind": "length",
        "symbol": "ext"
      },
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "V": "\\left(1+\\frac{[[ext]]}{[[f]]}\\right)^2",
      "ext": "[[f]]\\cdot\\left(\\sqrt{[[V]]}-1\\right)",
      "f": "\\frac{[[ext]]}{\\sqrt{[[V]]}-1}"
    },
    "outputs": [],
    "assumption": "Ideal photographic bellows compensation with a converging thin lens. The corrected source expression is V = (1 + ext/f)²; the factor is at least one.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-snell",
    "topic": "refraction",
    "title": "Snell’s Law — Inverse Quantities",
    "fields": [
      {
        "id": "n1",
        "name": "incident-medium refractive index",
        "kind": "dimensionless",
        "symbol": "n_1"
      },
      {
        "id": "n2",
        "name": "second-medium refractive index",
        "kind": "dimensionless",
        "symbol": "n_2"
      },
      {
        "id": "i",
        "name": "incidence angle from normal",
        "kind": "angle",
        "symbol": "\\theta_1"
      },
      {
        "id": "r",
        "name": "refraction angle from normal",
        "kind": "angle",
        "symbol": "\\theta_2"
      }
    ],
    "rules": {
      "n1": "\\frac{[[n2]]\\cdot\\sin[[r]]}{\\sin[[i]]}",
      "n2": "\\frac{[[n1]]\\cdot\\sin[[i]]}{\\sin[[r]]}",
      "i": "\\arcsin\\!\\left(\\frac{[[n2]]\\cdot\\sin[[r]]}{[[n1]]}\\right)",
      "r": "\\arcsin\\!\\left(\\frac{[[n1]]\\cdot\\sin[[i]]}{[[n2]]}\\right)"
    },
    "outputs": [],
    "assumption": "Positive real phase indices at a transparent interface; angles from the normal lie between 0 and π/2. No propagating refracted angle exists above the critical angle. At normal incidence the index ratio cannot be inferred from the angles.",
    "source": "Formelbuch",
    "pages": [
      64
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction"
  },
  {
    "id": "book-speed-refraction",
    "topic": "refraction",
    "title": "Refraction from Phase Speeds",
    "fields": [
      {
        "id": "v1",
        "name": "phase speed in incident medium",
        "kind": "velocity",
        "symbol": "c_1"
      },
      {
        "id": "v2",
        "name": "phase speed in second medium",
        "kind": "velocity",
        "symbol": "c_2"
      },
      {
        "id": "i",
        "name": "incidence angle from normal",
        "kind": "angle",
        "symbol": "\\theta_1"
      },
      {
        "id": "r",
        "name": "refraction angle from normal",
        "kind": "angle",
        "symbol": "\\theta_2"
      }
    ],
    "rules": {
      "v1": "\\frac{[[v2]]\\cdot\\sin[[i]]}{\\sin[[r]]}",
      "v2": "\\frac{[[v1]]\\cdot\\sin[[r]]}{\\sin[[i]]}",
      "i": "\\arcsin\\!\\left(\\frac{[[v1]]\\cdot\\sin[[r]]}{[[v2]]}\\right)",
      "r": "\\arcsin\\!\\left(\\frac{[[v2]]\\cdot\\sin[[i]]}{[[v1]]}\\right)"
    },
    "outputs": [],
    "assumption": "Snell’s law for phase speeds at a fixed frequency: sin θ₁ / sin θ₂ = c₁ / c₂. Both speeds are positive; angles are measured from the normal.",
    "source": "Formelbuch",
    "pages": [
      64
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction"
  },
  {
    "id": "book-critical-index",
    "topic": "refraction",
    "title": "Critical Angle and Refractive Indices",
    "fields": [
      {
        "id": "theta",
        "name": "critical angle",
        "kind": "angle",
        "symbol": "\\theta_c"
      },
      {
        "id": "n1",
        "name": "incident-medium refractive index",
        "kind": "dimensionless",
        "symbol": "n_1"
      },
      {
        "id": "n2",
        "name": "second-medium refractive index",
        "kind": "dimensionless",
        "symbol": "n_2"
      }
    ],
    "rules": {
      "theta": "\\arcsin\\!\\left(\\frac{[[n2]]}{[[n1]]}\\right)",
      "n1": "\\frac{[[n2]]}{\\sin[[theta]]}",
      "n2": "[[n1]]\\cdot\\sin[[theta]]"
    },
    "outputs": [],
    "assumption": "A true critical angle requires n₁ > n₂ > 0. Total internal reflection occurs for θ₁ > θc; the critical ray itself travels along the interface.",
    "source": "Formelbuch",
    "pages": [
      64
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction"
  },
  {
    "id": "book-critical-speed",
    "topic": "refraction",
    "title": "Critical Angle and Phase Speeds",
    "fields": [
      {
        "id": "theta",
        "name": "critical angle",
        "kind": "angle",
        "symbol": "\\theta_c"
      },
      {
        "id": "v1",
        "name": "incident-medium phase speed",
        "kind": "velocity",
        "symbol": "c_1"
      },
      {
        "id": "v2",
        "name": "second-medium phase speed",
        "kind": "velocity",
        "symbol": "c_2"
      }
    ],
    "rules": {
      "theta": "\\arcsin\\!\\left(\\frac{[[v1]]}{[[v2]]}\\right)",
      "v1": "[[v2]]\\cdot\\sin[[theta]]",
      "v2": "\\frac{[[v1]]}{\\sin[[theta]]}"
    },
    "outputs": [],
    "assumption": "The incident medium must have the lower phase speed: c₁ < c₂. For exit into vacuum, set c₂ = c₀.",
    "source": "Formelbuch",
    "pages": [
      64
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction"
  },
  {
    "id": "book-fiber-ratio",
    "topic": "fiber-optics",
    "title": "Optical Power Transmission Ratio",
    "fields": [
      {
        "id": "a",
        "name": "transmitted power ratio",
        "kind": "dimensionless",
        "symbol": "a"
      },
      {
        "id": "P1",
        "name": "input optical power",
        "kind": "power",
        "symbol": "P_1"
      },
      {
        "id": "P2",
        "name": "output optical power",
        "kind": "power",
        "symbol": "P_2"
      }
    ],
    "rules": {
      "a": "\\frac{[[P2]]}{[[P1]]}",
      "P1": "\\frac{[[P2]]}{[[a]]}",
      "P2": "[[a]]\\cdot[[P1]]"
    },
    "outputs": [],
    "assumption": "a = P₂/P₁; passive transmission has 0 ≤ a ≤ 1. The ratio is a power ratio, not an amplitude ratio.",
    "source": "Formelbuch",
    "pages": [
      67
    ],
    "reference": "https://www.rp-photonics.com/decibel.html"
  },
  {
    "id": "book-fiber-db",
    "topic": "fiber-optics",
    "title": "Optical Power Gain in Decibels",
    "fields": [
      {
        "id": "L",
        "name": "power gain in decibels",
        "kind": "decibel",
        "symbol": "L"
      },
      {
        "id": "P1",
        "name": "input optical power",
        "kind": "power",
        "symbol": "P_1"
      },
      {
        "id": "P2",
        "name": "output optical power",
        "kind": "power",
        "symbol": "P_2"
      }
    ],
    "rules": {
      "L": "10\\log_{10}\\!\\left(\\frac{[[P2]]}{[[P1]]}\\right)",
      "P1": "\\frac{[[P2]]}{10^{[[L]]/10}}",
      "P2": "[[P1]]\\cdot10^{[[L]]/10}"
    },
    "outputs": [],
    "assumption": "The source’s signed convention is gain L = 10 log₁₀(P₂/P₁), negative for attenuation. Positive insertion loss is −L. Zero optical power has no finite decibel value.",
    "source": "Formelbuch",
    "pages": [
      67
    ],
    "reference": "https://www.rp-photonics.com/decibel.html"
  },
  {
    "id": "book-fiber-dbm",
    "topic": "fiber-optics",
    "title": "Absolute Optical Power in dBm",
    "fields": [
      {
        "id": "L",
        "name": "absolute optical power level",
        "kind": "powerLevel",
        "symbol": "L_{dBm}"
      },
      {
        "id": "P",
        "name": "optical power",
        "kind": "power",
        "symbol": "P"
      }
    ],
    "rules": {
      "L": "10\\log_{10}\\!\\left(\\frac{[[P]]}{1\\,\\mathrm{mW}}\\right)",
      "P": "1\\,\\mathrm{mW}\\cdot10^{[[L]]/10}"
    },
    "outputs": [],
    "assumption": "dBm is an absolute power level referenced to exactly 1 mW. It is not attenuation: 0 dBm means 1 mW, and a positive level is physically valid.",
    "source": "Formelbuch",
    "pages": [
      67
    ],
    "reference": "https://www.rp-photonics.com/decibel.html"
  },
  {
    "id": "book-solar-projection",
    "topic": "heat-transfer",
    "title": "Solar Irradiance Projection",
    "fields": [
      {
        "id": "E",
        "name": "irradiance on receiving surface",
        "kind": "intensity",
        "symbol": "E"
      },
      {
        "id": "E0",
        "name": "normal irradiance",
        "kind": "intensity",
        "symbol": "E_0"
      },
      {
        "id": "alpha",
        "name": "angle above receiving surface",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "E": "[[E0]]\\cdot\\sin[[alpha]]",
      "E0": "\\frac{[[E]]}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[E]]}{[[E0]]}\\right)"
    },
    "outputs": [],
    "assumption": "Direct-beam geometric projection only; α is measured from the receiving surface, unlike the normal-angle convention in photometry. E₀ is supplied explicitly, not fixed to the source’s historical solar irradiance value. Atmospheric and diffuse radiation are excluded.",
    "source": "Formelbuch",
    "pages": [
      69
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-expansion-coefficients",
    "topic": "thermal-expansion",
    "title": "Isotropic Expansion Coefficients",
    "fields": [
      {
        "id": "beta",
        "name": "volume expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\gamma"
      },
      {
        "id": "alpha",
        "name": "linear expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "beta": "3\\cdot[[alpha]]",
      "alpha": "\\frac{[[beta]]}{3}"
    },
    "outputs": [],
    "assumption": "First-order approximation for isotropic solids: γ ≈ 3α. Liquid volume coefficients must be measured independently.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-heat-capacity-quantity",
    "topic": "heat-and-calorimetry",
    "title": "Heat and Heat Capacity",
    "fields": [
      {
        "id": "Q",
        "name": "heat transferred",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "C",
        "name": "heat capacity",
        "kind": "heatCapacity",
        "symbol": "C"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "Q": "[[C]]\\cdot[[dT]]",
      "C": "\\frac{[[Q]]}{[[dT]]}",
      "dT": "\\frac{[[Q]]}{[[C]]}"
    },
    "outputs": [],
    "assumption": "Constant heat capacity, no phase change; signed heat and temperature change. Zero temperature change cannot determine C from zero heat.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry"
  },
  {
    "id": "book-heat-rate",
    "topic": "heat-transfer",
    "title": "Heat Transfer Rate",
    "fields": [
      {
        "id": "P",
        "name": "heat transfer rate",
        "kind": "power",
        "symbol": "\\Phi"
      },
      {
        "id": "Q",
        "name": "heat transferred",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "P": "\\frac{[[Q]]}{[[t]]}",
      "Q": "[[P]]\\cdot[[t]]",
      "t": "\\frac{[[Q]]}{[[P]]}"
    },
    "outputs": [],
    "assumption": "Mean heat transfer rate over a positive elapsed interval.",
    "source": "Formelbuch",
    "pages": [
      71
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-advected-heat",
    "topic": "heat-transfer",
    "title": "Heat Carried by a Flow",
    "fields": [
      {
        "id": "P",
        "name": "heat transport rate",
        "kind": "power",
        "symbol": "\\Phi"
      },
      {
        "id": "mdot",
        "name": "mass flow rate",
        "kind": "massFlow",
        "symbol": "\\dot m"
      },
      {
        "id": "c",
        "name": "specific heat capacity",
        "kind": "specificHeat",
        "symbol": "c"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "P": "[[mdot]]\\cdot[[c]]\\cdot[[dT]]",
      "mdot": "\\frac{[[P]]}{[[c]]\\cdot[[dT]]}",
      "c": "\\frac{[[P]]}{[[mdot]]\\cdot[[dT]]}",
      "dT": "\\frac{[[P]]}{[[mdot]]\\cdot[[c]]}"
    },
    "outputs": [],
    "assumption": "Steady sensible-heat transport with constant specific heat and no phase change: Φ = ṁ c ΔT. The printed m·t·c·T expression is dimensionally incorrect; mass flow rate replaces mass times time.",
    "source": "Formelbuch",
    "pages": [
      71
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-conduction-rate",
    "topic": "heat-transfer",
    "title": "Conduction Through a Plane Layer",
    "fields": [
      {
        "id": "P",
        "name": "heat transfer rate",
        "kind": "power",
        "symbol": "\\Phi"
      },
      {
        "id": "k",
        "name": "thermal conductivity",
        "kind": "thermalConductivity",
        "symbol": "\\lambda"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      },
      {
        "id": "l",
        "name": "layer thickness",
        "kind": "length",
        "symbol": "\\ell"
      }
    ],
    "rules": {
      "P": "\\frac{[[k]]\\cdot[[A]]\\cdot[[dT]]}{[[l]]}",
      "k": "\\frac{[[P]]\\cdot[[l]]}{[[A]]\\cdot[[dT]]}",
      "A": "\\frac{[[P]]\\cdot[[l]]}{[[k]]\\cdot[[dT]]}",
      "dT": "\\frac{[[P]]\\cdot[[l]]}{[[k]]\\cdot[[A]]}",
      "l": "\\frac{[[k]]\\cdot[[A]]\\cdot[[dT]]}{[[P]]}"
    },
    "outputs": [],
    "assumption": "Steady one-dimensional conduction through a homogeneous plane layer with constant conductivity and no internal heat generation.",
    "source": "Formelbuch",
    "pages": [
      71
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-conduction-heat",
    "topic": "heat-transfer",
    "title": "Heat Conducted Through a Plane Layer",
    "fields": [
      {
        "id": "Q",
        "name": "heat transferred",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "k",
        "name": "thermal conductivity",
        "kind": "thermalConductivity",
        "symbol": "\\lambda"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      },
      {
        "id": "l",
        "name": "layer thickness",
        "kind": "length",
        "symbol": "\\ell"
      }
    ],
    "rules": {
      "Q": "\\frac{[[k]]\\cdot[[A]]\\cdot[[dT]]\\cdot[[t]]}{[[l]]}",
      "k": "\\frac{[[Q]]\\cdot[[l]]}{[[A]]\\cdot[[dT]]\\cdot[[t]]}",
      "A": "\\frac{[[Q]]\\cdot[[l]]}{[[k]]\\cdot[[dT]]\\cdot[[t]]}",
      "dT": "\\frac{[[Q]]\\cdot[[l]]}{[[k]]\\cdot[[A]]\\cdot[[t]]}",
      "t": "\\frac{[[Q]]\\cdot[[l]]}{[[k]]\\cdot[[A]]\\cdot[[dT]]}",
      "l": "\\frac{[[k]]\\cdot[[A]]\\cdot[[dT]]\\cdot[[t]]}{[[Q]]}"
    },
    "outputs": [],
    "assumption": "Constant steady conduction maintained throughout the interval; this also solves the source’s conductivity formula for every quantity.",
    "source": "Formelbuch",
    "pages": [
      71
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-convection-heat",
    "topic": "heat-transfer",
    "title": "Heat Transfer at a Surface",
    "fields": [
      {
        "id": "Q",
        "name": "heat transferred",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "hc",
        "name": "heat transfer coefficient",
        "kind": "heatTransferCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "Q": "[[hc]]\\cdot[[A]]\\cdot[[dT]]\\cdot[[t]]",
      "hc": "\\frac{[[Q]]}{[[A]]\\cdot[[dT]]\\cdot[[t]]}",
      "A": "\\frac{[[Q]]}{[[hc]]\\cdot[[dT]]\\cdot[[t]]}",
      "dT": "\\frac{[[Q]]}{[[hc]]\\cdot[[A]]\\cdot[[t]]}",
      "t": "\\frac{[[Q]]}{[[hc]]\\cdot[[A]]\\cdot[[dT]]}"
    },
    "outputs": [],
    "assumption": "Newton’s cooling relation with a constant effective heat transfer coefficient and fixed surface-to-fluid temperature difference.",
    "source": "Formelbuch",
    "pages": [
      71,
      72
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-layer-conductance",
    "topic": "heat-transfer",
    "title": "Conductance per Unit Area of a Layer",
    "fields": [
      {
        "id": "U",
        "name": "layer conductance per unit area",
        "kind": "heatTransferCoefficient",
        "symbol": "k"
      },
      {
        "id": "k",
        "name": "thermal conductivity",
        "kind": "thermalConductivity",
        "symbol": "\\lambda"
      },
      {
        "id": "l",
        "name": "layer thickness",
        "kind": "length",
        "symbol": "\\ell"
      }
    ],
    "rules": {
      "U": "\\frac{[[k]]}{[[l]]}",
      "k": "[[U]]\\cdot[[l]]",
      "l": "\\frac{[[k]]}{[[U]]}"
    },
    "outputs": [],
    "assumption": "k = λ/ℓ is the conductance per area of the solid layer alone. It is not the overall coefficient when finite surface resistances are present.",
    "source": "Formelbuch",
    "pages": [
      72
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-overall-heat",
    "topic": "heat-transfer",
    "title": "Heat Through an Overall Conductance",
    "fields": [
      {
        "id": "Q",
        "name": "heat transferred",
        "kind": "energy",
        "symbol": "Q"
      },
      {
        "id": "U",
        "name": "overall heat transfer coefficient",
        "kind": "heatTransferCoefficient",
        "symbol": "k"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "Q": "[[U]]\\cdot[[A]]\\cdot[[dT]]\\cdot[[t]]",
      "U": "\\frac{[[Q]]}{[[A]]\\cdot[[dT]]\\cdot[[t]]}",
      "A": "\\frac{[[Q]]}{[[U]]\\cdot[[dT]]\\cdot[[t]]}",
      "dT": "\\frac{[[Q]]}{[[U]]\\cdot[[A]]\\cdot[[t]]}",
      "t": "\\frac{[[Q]]}{[[U]]\\cdot[[A]]\\cdot[[dT]]}"
    },
    "outputs": [],
    "assumption": "Steady one-dimensional heat transfer between two fluids through a wall with fixed overall coefficient. All layers carry the same heat rate; their temperature drops and resistances add.",
    "source": "Formelbuch",
    "pages": [
      72
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-overall-coefficient",
    "topic": "heat-transfer",
    "title": "Overall Heat Transfer Coefficient",
    "fields": [
      {
        "id": "U",
        "name": "overall heat transfer coefficient",
        "kind": "heatTransferCoefficient",
        "symbol": "k"
      },
      {
        "id": "h1",
        "name": "first surface heat transfer coefficient",
        "kind": "heatTransferCoefficient",
        "symbol": "\\alpha_1"
      },
      {
        "id": "h2",
        "name": "second surface heat transfer coefficient",
        "kind": "heatTransferCoefficient",
        "symbol": "\\alpha_2"
      },
      {
        "id": "k",
        "name": "thermal conductivity",
        "kind": "thermalConductivity",
        "symbol": "\\lambda"
      },
      {
        "id": "l",
        "name": "layer thickness",
        "kind": "length",
        "symbol": "\\ell"
      }
    ],
    "rules": {
      "U": "\\frac{1}{\\frac{1}{[[h1]]}+\\frac{[[l]]}{[[k]]}+\\frac{1}{[[h2]]}}",
      "h1": "\\frac{1}{\\frac{1}{[[U]]}-\\frac{[[l]]}{[[k]]}-\\frac{1}{[[h2]]}}",
      "h2": "\\frac{1}{\\frac{1}{[[U]]}-\\frac{[[l]]}{[[k]]}-\\frac{1}{[[h1]]}}",
      "k": "\\frac{[[l]]}{\\frac{1}{[[U]]}-\\frac{1}{[[h1]]}-\\frac{1}{[[h2]]}}",
      "l": "[[k]]\\cdot\\left(\\frac{1}{[[U]]}-\\frac{1}{[[h1]]}-\\frac{1}{[[h2]]}\\right)"
    },
    "outputs": [],
    "assumption": "One homogeneous wall and two finite surface films with equal areas: 1/k = 1/α₁ + ℓ/λ + 1/α₂. The missing ℓ in the source’s overall-resistance formula is restored. Every resistance and coefficient must remain positive.",
    "source": "Formelbuch",
    "pages": [
      72
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer"
  },
  {
    "id": "book-bernoulli",
    "topic": "fluid-flow",
    "title": "Bernoulli’s Equation",
    "fields": [
      {
        "id": "p1",
        "name": "first static pressure",
        "kind": "pressure",
        "symbol": "p_1"
      },
      {
        "id": "p2",
        "name": "second static pressure",
        "kind": "pressure",
        "symbol": "p_2"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "v1",
        "name": "first flow speed",
        "kind": "velocity",
        "symbol": "v_1"
      },
      {
        "id": "v2",
        "name": "second flow speed",
        "kind": "velocity",
        "symbol": "v_2"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "h1",
        "name": "first elevation",
        "kind": "length",
        "symbol": "h_1"
      },
      {
        "id": "h2",
        "name": "second elevation",
        "kind": "length",
        "symbol": "h_2"
      }
    ],
    "rules": {
      "p1": "[[p2]]+[[rho]]\\cdot[[g]]\\cdot([[h2]]-[[h1]])+\\frac{[[rho]]}{2}([[v2]]^2-[[v1]]^2)",
      "p2": "[[p1]]+[[rho]]\\cdot[[g]]\\cdot([[h1]]-[[h2]])+\\frac{[[rho]]}{2}([[v1]]^2-[[v2]]^2)",
      "rho": "\\frac{[[p2]]-[[p1]]}{[[g]]\\cdot([[h1]]-[[h2]])+([[v1]]^2-[[v2]]^2)/2}",
      "v1": "\\sqrt{[[v2]]^2+2\\cdot([[p2]]-[[p1]])/[[rho]]+2\\cdot[[g]]\\cdot([[h2]]-[[h1]])}",
      "v2": "\\sqrt{[[v1]]^2+2\\cdot([[p1]]-[[p2]])/[[rho]]+2\\cdot[[g]]\\cdot([[h1]]-[[h2]])}",
      "g": "\\frac{([[p2]]-[[p1]])/[[rho]]+([[v2]]^2-[[v1]]^2)/2}{[[h1]]-[[h2]]}",
      "h1": "[[h2]]+\\frac{([[p2]]-[[p1]])/[[rho]]+([[v2]]^2-[[v1]]^2)/2}{[[g]]}",
      "h2": "[[h1]]+\\frac{([[p1]]-[[p2]])/[[rho]]+([[v1]]^2-[[v2]]^2)/2}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Steady incompressible inviscid flow along one streamline, with no pump, turbine or dissipative loss. Pressures share one reference; elevations share one datum. Set h₁ = h₂ for the horizontal Bernoulli–Venturi form. Equal elevations may make g underdetermined.",
    "source": "Formelbuch",
    "pages": [
      59
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation"
  },
  {
    "id": "book-normal-force",
    "topic": "dynamics",
    "title": "Normal Force on an Incline",
    "fields": [
      {
        "id": "Fn",
        "name": "normal force magnitude",
        "kind": "force",
        "symbol": "F_N"
      },
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "Fn": "[[Fg]]\\cdot\\cos[[alpha]]",
      "Fg": "\\frac{[[Fn]]}{\\cos[[alpha]]}",
      "alpha": "\\arccos\\!\\left(\\frac{[[Fn]]}{[[Fg]]}\\right)"
    },
    "outputs": [],
    "assumption": "No additional normal loads; angle 0 ≤ α ≤ π/2. At a vertical plane F_N = 0 independently of the weight.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-slope-component",
    "topic": "dynamics",
    "title": "Gravity Component Along an Incline",
    "fields": [
      {
        "id": "F",
        "name": "downhill gravity component",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "F": "[[m]]\\cdot[[g]]\\cdot\\sin[[alpha]]",
      "m": "\\frac{[[F]]}{[[g]]\\cdot\\sin[[alpha]]}",
      "g": "\\frac{[[F]]}{[[m]]\\cdot\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[F]]}{[[m]]\\cdot[[g]]}\\right)"
    },
    "outputs": [],
    "assumption": "Frictionless plane and no additional applied forces.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-slope-geometry",
    "topic": "dynamics",
    "title": "Inclined-Plane Geometry",
    "fields": [
      {
        "id": "h",
        "name": "rise",
        "kind": "length",
        "symbol": "h"
      },
      {
        "id": "s",
        "name": "slope length",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "h": "[[s]]\\cdot\\sin[[alpha]]",
      "s": "\\frac{[[h]]}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[h]]}{[[s]]}\\right)"
    },
    "outputs": [],
    "assumption": "Right-triangle geometry, positive slope length and 0 ≤ h ≤ s.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-slope-raising",
    "topic": "dynamics",
    "title": "Raising Force Along a Rough Incline",
    "fields": [
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "F": "[[Fg]]\\cdot(\\sin[[alpha]]+[[mu]]\\cdot\\cos[[alpha]])",
      "Fg": "\\frac{[[F]]}{\\sin[[alpha]]+[[mu]]\\cdot\\cos[[alpha]]}",
      "mu": "\\frac{\\frac{[[F]]}{[[Fg]]}-\\sin[[alpha]]}{\\cos[[alpha]]}",
      "alpha": "\\left\\{\\arcsin z-\\psi,\\ \\pi-\\arcsin z-\\psi\\right\\},\\quad z=\\frac{[[F]]}{[[Fg]]\\cdot\\sqrt{1+[[mu]]^2}},\\ \\psi=\\arctan([[mu]])"
    },
    "outputs": [],
    "assumption": "Already sliding contact with constant kinetic friction. F is the required applied uphill force for uniform upward motion. Signed F may be negative. All admissible angles in [0, π/2] are returned; no static-friction threshold is inferred.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-slope-lowering",
    "topic": "dynamics",
    "title": "Lowering Force Along a Rough Incline",
    "fields": [
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "Fg",
        "name": "weight magnitude",
        "kind": "force",
        "symbol": "F_G"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "F": "[[Fg]]\\cdot(\\sin[[alpha]]-[[mu]]\\cdot\\cos[[alpha]])",
      "Fg": "\\frac{[[F]]}{\\sin[[alpha]]-[[mu]]\\cdot\\cos[[alpha]]}",
      "mu": "\\frac{\\sin[[alpha]]-\\frac{[[F]]}{[[Fg]]}}{\\cos[[alpha]]}",
      "alpha": "\\left\\{\\arcsin z-\\psi,\\ \\pi-\\arcsin z-\\psi\\right\\},\\quad z=\\frac{[[F]]}{[[Fg]]\\cdot\\sqrt{1+[[mu]]^2}},\\ \\psi=\\arctan(-[[mu]])"
    },
    "outputs": [],
    "assumption": "Already sliding contact with constant kinetic friction. F is the downhill net force during free downward sliding, or the opposing force needed for uniform descent. Signed F may be negative. All admissible angles in [0, π/2] are returned; no static-friction threshold is inferred.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-slope-acceleration",
    "topic": "dynamics",
    "title": "Downhill Acceleration with Kinetic Friction",
    "fields": [
      {
        "id": "a",
        "name": "constant acceleration",
        "kind": "acceleration",
        "symbol": "a"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "a": "[[g]]\\cdot(\\sin[[alpha]]-[[mu]]\\cdot\\cos[[alpha]])",
      "g": "\\frac{[[a]]}{\\sin[[alpha]]-[[mu]]\\cdot\\cos[[alpha]]}",
      "mu": "\\frac{\\sin[[alpha]]-\\frac{[[a]]}{[[g]]}}{\\cos[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[a]]}{[[g]]\\cdot\\sqrt{1+[[mu]]^2}}\\right)+\\arctan[[mu]]"
    },
    "outputs": [],
    "assumption": "The body is already sliding downhill. Positive acceleration is downhill; negative acceleration is braking. No statement is made about starting to slide or subsequent reversal.",
    "source": "Formelbuch",
    "pages": [
      53
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"
  },
  {
    "id": "book-vertical-position",
    "topic": "kinematics",
    "title": "Vertical Position — Inverse Quantities",
    "fields": [
      {
        "id": "y",
        "name": "vertical coordinate",
        "kind": "length",
        "symbol": "y"
      },
      {
        "id": "y0",
        "name": "initial vertical coordinate",
        "kind": "length",
        "symbol": "y_0"
      },
      {
        "id": "u",
        "name": "initial vertical velocity",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "y": "[[y0]]+[[u]]\\cdot[[t]]-\\frac{[[g]]\\cdot[[t]]^2}{2}",
      "y0": "[[y]]-[[u]]\\cdot[[t]]+\\frac{[[g]]\\cdot[[t]]^2}{2}",
      "u": "\\frac{[[y]]-[[y0]]}{[[t]]}+\\frac{[[g]]\\cdot[[t]]}{2}",
      "g": "\\frac{2\\cdot([[y0]]+[[u]]\\cdot[[t]]-[[y]])}{[[t]]^2}",
      "t": "\\frac{[[u]]\\pm\\sqrt{[[u]]^2+2\\cdot[[g]]\\cdot([[y0]]-[[y]])}}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravity, no air resistance; upward coordinates and velocities are positive. Both ascending and descending times are retained when nonnegative. Set v₀ = 0 for free fall; a negative v₀ describes downward launch.",
    "source": "Formelbuch",
    "pages": [
      51,
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-vertical-velocity",
    "topic": "kinematics",
    "title": "Vertical Velocity — Inverse Quantities",
    "fields": [
      {
        "id": "v",
        "name": "signed vertical velocity",
        "kind": "velocity",
        "symbol": "v_y"
      },
      {
        "id": "u",
        "name": "initial vertical velocity",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "v": "[[u]]-[[g]]\\cdot[[t]]",
      "u": "[[v]]+[[g]]\\cdot[[t]]",
      "g": "\\frac{[[u]]-[[v]]}{[[t]]}",
      "t": "\\frac{[[u]]-[[v]]}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravity without drag; upward velocity is positive. Downward speed is the magnitude of a negative vertical velocity.",
    "source": "Formelbuch",
    "pages": [
      51,
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-projectile-energy",
    "topic": "kinematics",
    "title": "Projectile Speed and Height",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "h",
        "name": "height",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "v": "\\sqrt{[[v0]]^2-2\\cdot[[g]]\\cdot[[h]]}",
      "v0": "\\sqrt{[[v]]^2+2\\cdot[[g]]\\cdot[[h]]}",
      "g": "\\frac{[[v0]]^2-[[v]]^2}{2\\cdot[[h]]}",
      "h": "\\frac{[[v0]]^2-[[v]]^2}{2\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravity and no drag; h is signed height change from launch. v and v₀ are total speed magnitudes. A downward drop has negative h, giving the source’s positive 2g·drop-height term.",
    "source": "Formelbuch",
    "pages": [
      51,
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-free-fall-height",
    "topic": "kinematics",
    "title": "Drop Distance from Rest",
    "fields": [
      {
        "id": "h",
        "name": "drop distance",
        "kind": "length",
        "symbol": "h"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "h": "\\frac12\\cdot[[g]]\\cdot[[t]]^{2}",
      "g": "\\frac{[[h]]}{\\frac12\\cdot[[t]]^{2}}",
      "t": "\\sqrt{\\frac{[[h]]}{\\frac12\\cdot[[g]]}}"
    },
    "outputs": [],
    "assumption": "Free fall from rest in uniform gravity, no drag; downward distance and elapsed time are nonnegative.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-free-fall-speed",
    "topic": "kinematics",
    "title": "Speed After Falling from Rest",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "h",
        "name": "drop distance",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "v": "\\sqrt{2\\cdot[[g]]\\cdot[[h]]}",
      "g": "\\frac{[[v]]^{2}}{2\\cdot[[h]]}",
      "h": "\\frac{[[v]]^{2}}{2\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Free fall from rest, speed magnitude and positive downward drop distance.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-average-fall-speed",
    "topic": "kinematics",
    "title": "Drop Distance from Final Speed",
    "fields": [
      {
        "id": "h",
        "name": "drop distance",
        "kind": "length",
        "symbol": "h"
      },
      {
        "id": "v",
        "name": "speed",
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
      "h": "\\frac12\\cdot[[v]]\\cdot[[t]]",
      "v": "\\frac{[[h]]}{\\frac12\\cdot[[t]]}",
      "t": "\\frac{[[h]]}{\\frac12\\cdot[[v]]}"
    },
    "outputs": [],
    "assumption": "Constant gravitational acceleration from rest; the mean speed is half the final speed.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-maximum-height",
    "topic": "kinematics",
    "title": "Maximum Height of a Vertical Launch",
    "fields": [
      {
        "id": "hm",
        "name": "maximum height",
        "kind": "length",
        "symbol": "h_m"
      },
      {
        "id": "y0",
        "name": "initial vertical coordinate",
        "kind": "length",
        "symbol": "y_0"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "hm": "[[y0]]+\\frac{[[v0]]^2}{2\\cdot[[g]]}",
      "y0": "[[hm]]-\\frac{[[v0]]^2}{2\\cdot[[g]]}",
      "v0": "\\sqrt{2\\cdot[[g]]\\cdot([[hm]]-[[y0]])}",
      "g": "\\frac{[[v0]]^2}{2\\cdot([[hm]]-[[y0]])}"
    },
    "outputs": [],
    "assumption": "Vertical upward launch with nonnegative initial speed. The apex is after launch; this formula is not used for a downward initial velocity.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-vertical-apex-time",
    "topic": "kinematics",
    "title": "Time to the Vertical Apex",
    "fields": [
      {
        "id": "t",
        "name": "time to apex",
        "kind": "time",
        "symbol": "t"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "t": "\\frac{[[v0]]}{[[g]]}",
      "v0": "[[t]]\\cdot[[g]]",
      "g": "\\frac{[[v0]]}{[[t]]}"
    },
    "outputs": [],
    "assumption": "Vertical upward launch, uniform gravity, nonnegative initial speed.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-horizontal-trajectory",
    "topic": "kinematics",
    "title": "Horizontal-Launch Trajectory",
    "fields": [
      {
        "id": "y",
        "name": "drop below launch",
        "kind": "length",
        "symbol": "y"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "x",
        "name": "horizontal range magnitude",
        "kind": "length",
        "symbol": "x"
      },
      {
        "id": "v0",
        "name": "horizontal launch speed",
        "kind": "velocity",
        "symbol": "v_0"
      }
    ],
    "rules": {
      "y": "\\frac{\\frac12\\cdot[[g]]\\cdot[[x]]^{2}}{[[v0]]^{2}}",
      "g": "\\frac{[[y]]\\cdot[[v0]]^{2}}{\\frac12\\cdot[[x]]^{2}}",
      "x": "\\sqrt{\\frac{[[y]]\\cdot[[v0]]^{2}}{\\frac12\\cdot[[g]]}}",
      "v0": "\\sqrt{\\frac{\\frac12\\cdot[[g]]\\cdot[[x]]^{2}}{[[y]]}}"
    },
    "outputs": [],
    "assumption": "Horizontal launch in uniform gravity without drag; y is downward drop, unlike the upward coordinate in the animated trajectory. Positive horizontal speed is required; x is a range magnitude.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-speed-components",
    "topic": "kinematics",
    "title": "Speed from Orthogonal Velocity Components",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "vx",
        "name": "horizontal velocity magnitude",
        "kind": "velocity",
        "symbol": "v_x"
      },
      {
        "id": "vy",
        "name": "vertical velocity magnitude",
        "kind": "velocity",
        "symbol": "v_y"
      }
    ],
    "rules": {
      "v": "\\sqrt{[[vx]]^2+[[vy]]^2}",
      "vx": "\\sqrt{[[v]]^2-[[vy]]^2}",
      "vy": "\\sqrt{[[v]]^2-[[vx]]^2}"
    },
    "outputs": [],
    "assumption": "All components are magnitudes along perpendicular directions; direction signs are not inferred from the speed.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-falling-direction",
    "topic": "kinematics",
    "title": "Direction of a Horizontal-Launch Velocity",
    "fields": [
      {
        "id": "alpha",
        "name": "downward angle below horizontal",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      },
      {
        "id": "v0",
        "name": "horizontal launch speed",
        "kind": "velocity",
        "symbol": "v_0"
      }
    ],
    "rules": {
      "alpha": "\\arctan\\!\\left(\\frac{[[g]]\\cdot[[t]]}{[[v0]]}\\right)",
      "g": "\\frac{[[v0]]\\cdot\\tan[[alpha]]}{[[t]]}",
      "t": "\\frac{[[v0]]\\cdot\\tan[[alpha]]}{[[g]]}",
      "v0": "\\frac{[[g]]\\cdot[[t]]}{\\tan[[alpha]]}"
    },
    "outputs": [],
    "assumption": "Horizontal launch with positive horizontal speed. The angle is below horizontal and lies in [0, π/2).",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-launch-cos",
    "topic": "kinematics",
    "title": "Launch Velocity — Horizontal Component",
    "fields": [
      {
        "id": "vx",
        "name": "horizontal launch component",
        "kind": "velocity",
        "symbol": "v_x"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "vx": "[[v0]]\\cdot\\cos[[alpha]]",
      "v0": "\\frac{[[vx]]}{\\cos[[alpha]]}",
      "alpha": "\\arccos\\!\\left(\\frac{[[vx]]}{[[v0]]}\\right)"
    },
    "outputs": [],
    "assumption": "Upward launch with 0 ≤ α < π/2, no drag. Components and launch speed are magnitudes. The trigonometric inverse is restricted to the declared angle interval.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-launch-sin",
    "topic": "kinematics",
    "title": "Launch Velocity — Vertical Component",
    "fields": [
      {
        "id": "vy",
        "name": "initial upward component",
        "kind": "velocity",
        "symbol": "v_{y0}"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "vy": "[[v0]]\\cdot\\sin[[alpha]]",
      "v0": "\\frac{[[vy]]}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[vy]]}{[[v0]]}\\right)"
    },
    "outputs": [],
    "assumption": "Upward launch with 0 ≤ α < π/2, no drag. Components and launch speed are magnitudes. The trigonometric inverse is restricted to the declared angle interval.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-flight-time",
    "topic": "kinematics",
    "title": "Oblique Flight Time to Launch Level",
    "fields": [
      {
        "id": "t",
        "name": "return time",
        "kind": "time",
        "symbol": "t"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "t": "\\frac{2\\cdot[[v0]]\\cdot\\sin[[alpha]]}{[[g]]}",
      "v0": "\\frac{[[g]]\\cdot[[t]]}{2\\cdot\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[g]]\\cdot[[t]]}{2\\cdot[[v0]]}\\right)",
      "g": "\\frac{2\\cdot[[v0]]\\cdot\\sin[[alpha]]}{[[t]]}"
    },
    "outputs": [],
    "assumption": "Return to the launch height in uniform gravity. The return time is twice the time to the apex. Zero angle or speed gives zero duration, without a finite airborne interval.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-range",
    "topic": "kinematics",
    "title": "Oblique Range at Equal Heights",
    "fields": [
      {
        "id": "R",
        "name": "horizontal range",
        "kind": "length",
        "symbol": "R"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "R": "\\frac{[[v0]]^2\\cdot\\sin(2\\cdot[[alpha]])}{[[g]]}",
      "v0": "\\sqrt{\\frac{[[R]]\\cdot[[g]]}{\\sin(2\\cdot[[alpha]])}}",
      "alpha": "\\left\\{\\frac12\\arcsin z,\\ \\frac{\\pi}{2}-\\frac12\\arcsin z\\right\\},\\quad z=\\frac{[[R]]\\cdot[[g]]}{[[v0]]^2}",
      "g": "\\frac{[[v0]]^2\\cdot\\sin(2\\cdot[[alpha]])}{[[R]]}"
    },
    "outputs": [],
    "assumption": "Launch and landing at the same height, uniform gravity and no drag. The source mistakenly equates range and maximum height; the corrected range is v₀² sin(2α)/g. Both complementary launch angles are returned when admissible.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-apex-height",
    "topic": "kinematics",
    "title": "Oblique Maximum Rise",
    "fields": [
      {
        "id": "h",
        "name": "rise above launch",
        "kind": "length",
        "symbol": "h"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "h": "\\frac{[[v0]]^2\\cdot\\sin^2[[alpha]]}{2\\cdot[[g]]}",
      "v0": "\\frac{\\sqrt{2\\cdot[[g]]\\cdot[[h]]}}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{\\sqrt{2\\cdot[[g]]\\cdot[[h]]}}{[[v0]]}\\right)",
      "g": "\\frac{[[v0]]^2\\cdot\\sin^2[[alpha]]}{2\\cdot[[h]]}"
    },
    "outputs": [],
    "assumption": "Upward oblique launch with no drag. Maximum rise is v₀² sin²α/(2g); it is not the range. Time to this apex is v₀ sin α/g, half the equal-height flight time.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-trajectory",
    "topic": "kinematics",
    "title": "Oblique Trajectory — Inverse Quantities",
    "fields": [
      {
        "id": "y",
        "name": "height above launch",
        "kind": "length",
        "symbol": "y"
      },
      {
        "id": "x",
        "name": "horizontal distance from launch",
        "kind": "length",
        "symbol": "x"
      },
      {
        "id": "v0",
        "name": "launch speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "y": "[[x]]\\cdot\\tan[[alpha]]-\\frac{[[g]]\\cdot[[x]]^2}{2\\cdot[[v0]]^2\\cdot\\cos^2[[alpha]]}",
      "x": "\\frac{[[v0]]^2\\cdot\\cos^2[[alpha]]}{[[g]]}\\left(\\tan[[alpha]]\\pm\\sqrt{\\tan^2[[alpha]]-\\frac{2\\cdot[[g]]\\cdot[[y]]}{[[v0]]^2\\cdot\\cos^2[[alpha]]}}\\right)",
      "v0": "\\sqrt{\\frac{[[g]]\\cdot[[x]]^2}{2\\cdot\\cos^2[[alpha]]\\cdot([[x]]\\cdot\\tan[[alpha]]-[[y]])}}",
      "alpha": "\\arctan\\!\\left(\\frac{[[v0]]^2\\pm\\sqrt{[[v0]]^4-[[g]]\\cdot([[g]]\\cdot[[x]]^2+2\\cdot[[y]]\\cdot[[v0]]^2)}}{[[g]]\\cdot[[x]]}\\right)",
      "g": "\\frac{2\\cdot[[v0]]^2\\cdot\\cos^2[[alpha]]\\cdot([[x]]\\cdot\\tan[[alpha]]-[[y]])}{[[x]]^2}"
    },
    "outputs": [],
    "assumption": "Uniform gravity and no drag; y is upward displacement from launch and x ≥ 0. Launch angle lies in [0, π/2), so vertical launches use the vertical model. Both admissible distances or launch angles are retained. At x = y = 0, launch angle, speed and gravity cannot be inferred.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-thermal-mixing",
    "topic": "heat-and-calorimetry",
    "title": "Thermal Mixing — Inverse Quantities",
    "fields": [
      {
        "id": "Tm",
        "name": "equilibrium temperature",
        "kind": "temperature",
        "symbol": "T_M"
      },
      {
        "id": "T1",
        "name": "first initial temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "T2",
        "name": "second initial temperature",
        "kind": "temperature",
        "symbol": "T_2"
      },
      {
        "id": "c1",
        "name": "first specific heat",
        "kind": "specificHeat",
        "symbol": "c_1"
      },
      {
        "id": "c2",
        "name": "second specific heat",
        "kind": "specificHeat",
        "symbol": "c_2"
      },
      {
        "id": "m1",
        "name": "first mass",
        "kind": "mass",
        "symbol": "m_1"
      },
      {
        "id": "m2",
        "name": "second mass",
        "kind": "mass",
        "symbol": "m_2"
      }
    ],
    "rules": {
      "Tm": "\\frac{[[c1]]\\cdot[[m1]]\\cdot[[T1]]+[[c2]]\\cdot[[m2]]\\cdot[[T2]]}{[[c1]]\\cdot[[m1]]+[[c2]]\\cdot[[m2]]}",
      "T1": "[[Tm]]+\\frac{[[c2]]\\cdot[[m2]]\\cdot([[Tm]]-[[T2]])}{[[c1]]\\cdot[[m1]]}",
      "T2": "[[Tm]]-\\frac{[[c1]]\\cdot[[m1]]\\cdot([[T1]]-[[Tm]])}{[[c2]]\\cdot[[m2]]}",
      "c1": "\\frac{[[c2]]\\cdot[[m2]]\\cdot([[Tm]]-[[T2]])}{[[m1]]\\cdot([[T1]]-[[Tm]])}",
      "c2": "\\frac{[[c1]]\\cdot[[m1]]\\cdot([[T1]]-[[Tm]])}{[[m2]]\\cdot([[Tm]]-[[T2]])}",
      "m1": "\\frac{[[c2]]\\cdot[[m2]]\\cdot([[Tm]]-[[T2]])}{[[c1]]\\cdot([[T1]]-[[Tm]])}",
      "m2": "\\frac{[[c1]]\\cdot[[m1]]\\cdot([[T1]]-[[Tm]])}{[[c2]]\\cdot([[Tm]]-[[T2]])}"
    },
    "outputs": [],
    "assumption": "Two positive masses in an isolated system with constant positive specific heats, no phase change and no container heat capacity. Equal initial temperatures leave masses and heat capacities underdetermined. For identical specific heats the common factor cancels, giving the source’s mass-weighted mean.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry"
  },
  {
    "id": "book-hydrostatic",
    "topic": "fluid-statics",
    "title": "Hydrostatic Pressure — Including Gravity",
    "fields": [
      {
        "id": "p",
        "name": "pressure increase with depth",
        "kind": "pressure",
        "symbol": "\\Delta p"
      },
      {
        "id": "rho",
        "name": "fluid density",
        "kind": "density",
        "symbol": "\\rho"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "h",
        "name": "depth increase",
        "kind": "length",
        "symbol": "h"
      }
    ],
    "rules": {
      "p": "[[rho]]\\cdot[[g]]\\cdot[[h]]",
      "rho": "\\frac{[[p]]}{[[g]]\\cdot[[h]]}",
      "g": "\\frac{[[p]]}{[[rho]]\\cdot[[h]]}",
      "h": "\\frac{[[p]]}{[[rho]]\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Uniform incompressible fluid and uniform gravity. This inverse form also permits solving for gravitational acceleration without a default value.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-hydrostatic-mass",
    "topic": "fluid-statics",
    "title": "Pressure of a Uniform Fluid Column",
    "fields": [
      {
        "id": "p",
        "name": "pressure from the fluid column",
        "kind": "pressure",
        "symbol": "p"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "A",
        "name": "area",
        "kind": "area",
        "symbol": "A"
      }
    ],
    "rules": {
      "p": "\\frac{[[m]]\\cdot[[g]]}{[[A]]}",
      "m": "\\frac{[[p]]\\cdot[[A]]}{[[g]]}",
      "g": "\\frac{[[p]]\\cdot[[A]]}{[[m]]}",
      "A": "\\frac{[[m]]\\cdot[[g]]}{[[p]]}"
    },
    "outputs": [],
    "assumption": "Uniform column of fluid of mass m above cross-section A; p = mg/A = ρgh. Surface pressure is excluded.",
    "source": "Formelbuch",
    "pages": [
      58
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy"
  },
  {
    "id": "book-horizontal-friction-work",
    "topic": "work-energy",
    "title": "Frictional Dissipation on a Horizontal Surface",
    "fields": [
      {
        "id": "W",
        "name": "dissipated energy",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "mu",
        "name": "kinetic friction coefficient",
        "kind": "dimensionless",
        "symbol": "\\mu"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "s",
        "name": "sliding distance",
        "kind": "length",
        "symbol": "s"
      }
    ],
    "rules": {
      "W": "[[mu]]\\cdot[[m]]\\cdot[[g]]\\cdot[[s]]",
      "mu": "\\frac{[[W]]}{[[m]]\\cdot[[g]]\\cdot[[s]]}",
      "m": "\\frac{[[W]]}{[[mu]]\\cdot[[g]]\\cdot[[s]]}",
      "g": "\\frac{[[W]]}{[[mu]]\\cdot[[m]]\\cdot[[s]]}",
      "s": "\\frac{[[W]]}{[[mu]]\\cdot[[m]]\\cdot[[g]]}"
    },
    "outputs": [],
    "assumption": "Already sliding horizontal contact with no extra normal loads, so F_N = mg. Positive dissipated energy; the work of friction on the body is negative.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-power-force-distance",
    "topic": "work-energy",
    "title": "Power from Force and Travel",
    "fields": [
      {
        "id": "P",
        "name": "power",
        "kind": "power",
        "symbol": "P"
      },
      {
        "id": "F",
        "name": "force",
        "kind": "force",
        "symbol": "F"
      },
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "P": "\\frac{[[F]]\\cdot[[s]]}{[[t]]}",
      "F": "\\frac{[[P]]\\cdot[[t]]}{[[s]]}",
      "s": "\\frac{[[P]]\\cdot[[t]]}{[[F]]}",
      "t": "\\frac{[[F]]\\cdot[[s]]}{[[P]]}"
    },
    "outputs": [],
    "assumption": "Constant force component along the travel direction; mean power over the elapsed interval.",
    "source": "Formelbuch",
    "pages": [
      56
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-incline-work",
    "topic": "work-energy",
    "title": "Work Against Gravity Along an Incline",
    "fields": [
      {
        "id": "W",
        "name": "work",
        "kind": "energy",
        "symbol": "W"
      },
      {
        "id": "m",
        "name": "mass",
        "kind": "mass",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "s",
        "name": "displacement",
        "kind": "length",
        "symbol": "s"
      },
      {
        "id": "alpha",
        "name": "inclination angle",
        "kind": "angle",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "W": "[[m]]\\cdot[[g]]\\cdot[[s]]\\cdot\\sin[[alpha]]",
      "m": "\\frac{[[W]]}{[[g]]\\cdot[[s]]\\cdot\\sin[[alpha]]}",
      "g": "\\frac{[[W]]}{[[m]]\\cdot[[s]]\\cdot\\sin[[alpha]]}",
      "s": "\\frac{[[W]]}{[[m]]\\cdot[[g]]\\cdot\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[W]]}{[[m]]\\cdot[[g]]\\cdot[[s]]}\\right)"
    },
    "outputs": [],
    "assumption": "Frictionless quasistatic displacement along an incline; positive s is uphill. Work done against gravity equals mgh with h = s sin α.",
    "source": "Formelbuch",
    "pages": [
      54
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/7-summary"
  },
  {
    "id": "book-total-length-expansion",
    "topic": "thermal-expansion",
    "title": "Final Length After Expansion",
    "fields": [
      {
        "id": "z",
        "name": "final length",
        "kind": "length",
        "symbol": "L_{tot}"
      },
      {
        "id": "z0",
        "name": "initial length",
        "kind": "length",
        "symbol": "L_0"
      },
      {
        "id": "co",
        "name": "linear expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "z": "[[z0]]\\cdot(1+1\\cdot[[co]]\\cdot[[dT]])",
      "z0": "\\frac{[[z]]}{1+1\\cdot[[co]]\\cdot[[dT]]}",
      "co": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{1\\cdot[[dT]]}",
      "dT": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{1\\cdot[[co]]}"
    },
    "outputs": [],
    "assumption": "Constant-coefficient first-order thermal expansion with positive initial and final dimensions. Use a constant mean linear coefficient over the interval.",
    "source": "Formelbuch",
    "pages": [
      69
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-additive-length-expansion",
    "topic": "thermal-expansion",
    "title": "Length Change and Final Size",
    "fields": [
      {
        "id": "z",
        "name": "final length",
        "kind": "length",
        "symbol": "L_{tot}"
      },
      {
        "id": "z0",
        "name": "initial length",
        "kind": "length",
        "symbol": "L_0"
      },
      {
        "id": "dz",
        "name": "size change",
        "kind": "length",
        "symbol": "\\Delta L"
      }
    ],
    "rules": {
      "z": "[[z0]]+[[dz]]",
      "z0": "[[z]]-[[dz]]",
      "dz": "[[z]]-[[z0]]"
    },
    "outputs": [],
    "assumption": "Final size is initial size plus the signed change. Both physical sizes must remain positive; contraction has negative change.",
    "source": "Formelbuch",
    "pages": [
      69
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-total-area-expansion",
    "topic": "thermal-expansion",
    "title": "Final Area After Expansion",
    "fields": [
      {
        "id": "z",
        "name": "final area",
        "kind": "area",
        "symbol": "A_{tot}"
      },
      {
        "id": "z0",
        "name": "initial area",
        "kind": "area",
        "symbol": "A_0"
      },
      {
        "id": "co",
        "name": "linear expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\alpha"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "z": "[[z0]]\\cdot(1+2\\cdot[[co]]\\cdot[[dT]])",
      "z0": "\\frac{[[z]]}{1+2\\cdot[[co]]\\cdot[[dT]]}",
      "co": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{2\\cdot[[dT]]}",
      "dT": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{2\\cdot[[co]]}"
    },
    "outputs": [],
    "assumption": "Constant-coefficient first-order thermal expansion with positive initial and final dimensions. For area, 2α applies to an isotropic solid and small strains.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-additive-area-expansion",
    "topic": "thermal-expansion",
    "title": "Area Change and Final Size",
    "fields": [
      {
        "id": "z",
        "name": "final area",
        "kind": "area",
        "symbol": "A_{tot}"
      },
      {
        "id": "z0",
        "name": "initial area",
        "kind": "area",
        "symbol": "A_0"
      },
      {
        "id": "dz",
        "name": "size change",
        "kind": "area",
        "symbol": "\\Delta A"
      }
    ],
    "rules": {
      "z": "[[z0]]+[[dz]]",
      "z0": "[[z]]-[[dz]]",
      "dz": "[[z]]-[[z0]]"
    },
    "outputs": [],
    "assumption": "Final size is initial size plus the signed change. Both physical sizes must remain positive; contraction has negative change.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-total-volume-expansion",
    "topic": "thermal-expansion",
    "title": "Final Volume After Expansion",
    "fields": [
      {
        "id": "z",
        "name": "final volume",
        "kind": "volume",
        "symbol": "V_{tot}"
      },
      {
        "id": "z0",
        "name": "initial volume",
        "kind": "volume",
        "symbol": "V_0"
      },
      {
        "id": "co",
        "name": "volume expansion coefficient",
        "kind": "expansionCoefficient",
        "symbol": "\\gamma"
      },
      {
        "id": "dT",
        "name": "temperature difference",
        "kind": "temperatureDifference",
        "symbol": "\\Delta T"
      }
    ],
    "rules": {
      "z": "[[z0]]\\cdot(1+1\\cdot[[co]]\\cdot[[dT]])",
      "z0": "\\frac{[[z]]}{1+1\\cdot[[co]]\\cdot[[dT]]}",
      "co": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{1\\cdot[[dT]]}",
      "dT": "\\frac{\\frac{[[z]]}{[[z0]]}-1}{1\\cdot[[co]]}"
    },
    "outputs": [],
    "assumption": "Constant-coefficient first-order thermal expansion with positive initial and final dimensions. For isotropic solids γ ≈ 3α; liquids use their independent volume coefficient.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-additive-volume-expansion",
    "topic": "thermal-expansion",
    "title": "Volume Change and Final Size",
    "fields": [
      {
        "id": "z",
        "name": "final volume",
        "kind": "volume",
        "symbol": "V_{tot}"
      },
      {
        "id": "z0",
        "name": "initial volume",
        "kind": "volume",
        "symbol": "V_0"
      },
      {
        "id": "dz",
        "name": "size change",
        "kind": "volume",
        "symbol": "\\Delta V"
      }
    ],
    "rules": {
      "z": "[[z0]]+[[dz]]",
      "z0": "[[z]]-[[dz]]",
      "dz": "[[z]]-[[z0]]"
    },
    "outputs": [],
    "assumption": "Final size is initial size plus the signed change. Both physical sizes must remain positive; contraction has negative change.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-3-thermal-expansion"
  },
  {
    "id": "book-magnification-focal-image",
    "topic": "optical-imaging",
    "title": "Real-Image Magnification from Image Distance",
    "fields": [
      {
        "id": "m",
        "name": "image-size ratio",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "b",
        "name": "real image distance",
        "kind": "length",
        "symbol": "b"
      },
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "m": "\\frac{[[b]]}{[[f]]}-1",
      "b": "[[f]]\\cdot(1+[[m]])",
      "f": "\\frac{[[b]]}{1+[[m]]}"
    },
    "outputs": [],
    "assumption": "Converging thin lens, real object and real image. This is the positive size ratio, not signed transverse magnification.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-magnification-focal-object",
    "topic": "optical-imaging",
    "title": "Real-Image Magnification from Object Distance",
    "fields": [
      {
        "id": "m",
        "name": "image-size ratio",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "g",
        "name": "object distance",
        "kind": "length",
        "symbol": "g"
      },
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      }
    ],
    "rules": {
      "m": "\\frac{[[f]]}{[[g]]-[[f]]}",
      "g": "[[f]]\\cdot\\left(1+\\frac{1}{[[m]]}\\right)",
      "f": "\\frac{[[m]]\\cdot[[g]]}{1+[[m]]}"
    },
    "outputs": [],
    "assumption": "Converging thin lens, real image and object outside the focal plane. This is a size magnitude; signed magnification has the opposite sign.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-angular-period",
    "topic": "rotation",
    "title": "Angular Speed and Period",
    "fields": [
      {
        "id": "omega",
        "name": "angular speed",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "symbol": "T"
      }
    ],
    "rules": {
      "omega": "\\frac{2\\pi}{[[T]]}",
      "T": "\\frac{2\\pi}{[[omega]]}"
    },
    "outputs": [],
    "assumption": "Uniform rotation, one full revolution per period.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-tangential-period",
    "topic": "rotation",
    "title": "Tangential Speed and Period",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "T",
        "name": "period",
        "kind": "time",
        "symbol": "T"
      }
    ],
    "rules": {
      "v": "\\frac{2\\pi\\cdot[[r]]}{[[T]]}",
      "r": "\\frac{[[v]]\\cdot[[T]]}{2\\pi}",
      "T": "\\frac{2\\pi\\cdot[[r]]}{[[v]]}"
    },
    "outputs": [],
    "assumption": "Positive radius, speed magnitude and rotation period.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-tangential-frequency",
    "topic": "rotation",
    "title": "Tangential Speed and Rotation Frequency",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "r",
        "name": "radius",
        "kind": "length",
        "symbol": "r"
      },
      {
        "id": "f",
        "name": "rotation frequency",
        "kind": "frequency",
        "symbol": "f"
      }
    ],
    "rules": {
      "v": "2\\pi\\cdot[[r]]\\cdot[[f]]",
      "r": "\\frac{[[v]]}{2\\pi\\cdot[[f]]}",
      "f": "\\frac{[[v]]}{2\\pi\\cdot[[r]]}"
    },
    "outputs": [],
    "assumption": "Positive radius and rotation-frequency magnitude.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-acceleration-rest",
    "topic": "rotation",
    "title": "Angular Acceleration from Rest",
    "fields": [
      {
        "id": "omega",
        "name": "final angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "omega": "[[alpha]]\\cdot[[t]]",
      "alpha": "\\frac{[[omega]]}{[[t]]}",
      "t": "\\frac{[[omega]]}{[[alpha]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration from zero initial angular velocity.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-rest-position",
    "topic": "rotation",
    "title": "Angular Displacement from Rest",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "phi": "\\frac12\\cdot[[alpha]]\\cdot[[t]]^{2}",
      "alpha": "\\frac{[[phi]]}{\\frac12\\cdot[[t]]^{2}}",
      "t": "\\sqrt{\\frac{[[phi]]}{\\frac12\\cdot[[alpha]]}}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration from rest. Nonnegative elapsed time; angular acceleration and displacement have the same sign.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-rest-average",
    "topic": "rotation",
    "title": "Mean Angular Velocity from Rest",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "phi": "\\frac12\\cdot[[omega]]\\cdot[[t]]",
      "omega": "\\frac{[[phi]]}{\\frac12\\cdot[[t]]}",
      "t": "\\frac{[[phi]]}{\\frac12\\cdot[[omega]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration from rest; the mean angular velocity is half the final value.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-equal-heat-mixing",
    "topic": "heat-and-calorimetry",
    "title": "Thermal Mixing with Equal Specific Heats",
    "fields": [
      {
        "id": "Tm",
        "name": "equilibrium temperature",
        "kind": "temperature",
        "symbol": "T_M"
      },
      {
        "id": "T1",
        "name": "first initial temperature",
        "kind": "temperature",
        "symbol": "T_1"
      },
      {
        "id": "T2",
        "name": "second initial temperature",
        "kind": "temperature",
        "symbol": "T_2"
      },
      {
        "id": "m1",
        "name": "first mass",
        "kind": "mass",
        "symbol": "m_1"
      },
      {
        "id": "m2",
        "name": "second mass",
        "kind": "mass",
        "symbol": "m_2"
      }
    ],
    "rules": {
      "Tm": "\\frac{[[m1]]\\cdot[[T1]]+[[m2]]\\cdot[[T2]]}{[[m1]]+[[m2]]}",
      "T1": "[[Tm]]+\\frac{[[m2]]\\cdot([[Tm]]-[[T2]])}{[[m1]]}",
      "T2": "[[Tm]]-\\frac{[[m1]]\\cdot([[T1]]-[[Tm]])}{[[m2]]}",
      "m1": "\\frac{[[m2]]\\cdot([[Tm]]-[[T2]])}{[[T1]]-[[Tm]]}",
      "m2": "\\frac{[[m1]]\\cdot([[T1]]-[[Tm]])}{[[Tm]]-[[T2]]}"
    },
    "outputs": [],
    "assumption": "Two thermally isolated bodies with the same constant positive specific heat, no phase change and negligible container heat capacity. The common specific heat cancels; equal initial temperatures cannot determine the mass ratio.",
    "source": "Formelbuch",
    "pages": [
      70
    ],
    "reference": "https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry"
  },
  {
    "id": "book-angular-rest-energy-angle",
    "topic": "rotation",
    "title": "Angular Acceleration from Angular Displacement",
    "fields": [
      {
        "id": "phi",
        "name": "angular displacement",
        "kind": "angle",
        "symbol": "\\varphi"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "phi": "\\frac{[[omega]]^2}{2\\cdot[[alpha]]}",
      "omega": "\\pm\\sqrt{2\\cdot[[alpha]]\\cdot[[phi]]}",
      "alpha": "\\frac{[[omega]]^2}{2\\cdot[[phi]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration from rest; signed angular velocity admits both square-root branches. Angular displacement and revolution count are signed.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-angular-rest-energy-revolutions",
    "topic": "rotation",
    "title": "Angular Acceleration from Revolutions",
    "fields": [
      {
        "id": "N",
        "name": "number of revolutions",
        "kind": "dimensionless",
        "symbol": "N"
      },
      {
        "id": "omega",
        "name": "angular velocity",
        "kind": "angularVelocity",
        "symbol": "\\omega"
      },
      {
        "id": "alpha",
        "name": "angular acceleration",
        "kind": "angularAcceleration",
        "symbol": "\\alpha"
      }
    ],
    "rules": {
      "N": "\\frac{[[omega]]^2}{4\\pi\\cdot[[alpha]]}",
      "omega": "\\pm\\sqrt{4\\pi\\cdot[[alpha]]\\cdot[[N]]}",
      "alpha": "\\frac{[[omega]]^2}{4\\pi\\cdot[[N]]}"
    },
    "outputs": [],
    "assumption": "Constant angular acceleration from rest; signed angular velocity admits both square-root branches. Angular displacement and revolution count are signed.",
    "source": "Formelbuch",
    "pages": [
      50
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/10-2-rotation-with-constant-angular-acceleration"
  },
  {
    "id": "book-free-fall-speed-time",
    "topic": "kinematics",
    "title": "Free-Fall Speed and Time",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "v": "[[g]]\\cdot[[t]]",
      "g": "\\frac{[[v]]}{[[t]]}",
      "t": "\\frac{[[v]]}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Free fall from rest in uniform gravity without drag. v is the nonnegative downward speed.",
    "source": "Formelbuch",
    "pages": [
      51
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-horizontal-speed-time",
    "topic": "kinematics",
    "title": "Horizontal-Launch Speed at a Given Time",
    "fields": [
      {
        "id": "v",
        "name": "speed",
        "kind": "velocity",
        "symbol": "v"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "v": "\\sqrt{[[v0]]^2+([[g]]\\cdot[[t]])^2}",
      "v0": "\\sqrt{[[v]]^2-([[g]]\\cdot[[t]])^2}",
      "g": "\\frac{\\sqrt{[[v]]^2-[[v0]]^2}}{[[t]]}",
      "t": "\\frac{\\sqrt{[[v]]^2-[[v0]]^2}}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Horizontal launch without drag. v₀ is horizontal speed and v is total speed magnitude. Uniform gravity gives the vertical speed g t.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-falling-direction-depth",
    "topic": "kinematics",
    "title": "Horizontal-Launch Direction from Drop Depth",
    "fields": [
      {
        "id": "alpha",
        "name": "downward angle below horizontal",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "y",
        "name": "drop below launch",
        "kind": "length",
        "symbol": "y"
      },
      {
        "id": "v0",
        "name": "horizontal launch speed",
        "kind": "velocity",
        "symbol": "v_0"
      }
    ],
    "rules": {
      "alpha": "\\arctan\\!\\left(\\frac{\\sqrt{2\\cdot[[g]]\\cdot[[y]]}}{[[v0]]}\\right)",
      "g": "\\frac{[[v0]]^2\\cdot\\tan^2[[alpha]]}{2\\cdot[[y]]}",
      "y": "\\frac{[[v0]]^2\\cdot\\tan^2[[alpha]]}{2\\cdot[[g]]}",
      "v0": "\\frac{\\sqrt{2\\cdot[[g]]\\cdot[[y]]}}{\\tan[[alpha]]}"
    },
    "outputs": [],
    "assumption": "Horizontal launch with positive horizontal speed and uniform gravity. Drop depth is positive downward; the velocity direction is measured below horizontal.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-vertical-velocity",
    "topic": "kinematics",
    "title": "Vertical Velocity of an Oblique Launch",
    "fields": [
      {
        "id": "vy",
        "name": "signed vertical velocity",
        "kind": "velocity",
        "symbol": "v_y"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      },
      {
        "id": "t",
        "name": "elapsed time",
        "kind": "time",
        "symbol": "t"
      }
    ],
    "rules": {
      "vy": "[[v0]]\\cdot\\sin[[alpha]]-[[g]]\\cdot[[t]]",
      "v0": "\\frac{[[vy]]+[[g]]\\cdot[[t]]}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[vy]]+[[g]]\\cdot[[t]]}{[[v0]]}\\right)",
      "g": "\\frac{[[v0]]\\cdot\\sin[[alpha]]-[[vy]]}{[[t]]}",
      "t": "\\frac{[[v0]]\\cdot\\sin[[alpha]]-[[vy]]}{[[g]]}"
    },
    "outputs": [],
    "assumption": "Upward coordinates, uniform gravity and no drag. Initial launch angle lies in [0, π/2); later vertical velocity can be positive, zero at the apex, or negative.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-oblique-apex-time",
    "topic": "kinematics",
    "title": "Time to the Oblique Apex",
    "fields": [
      {
        "id": "t",
        "name": "time to apex",
        "kind": "time",
        "symbol": "t"
      },
      {
        "id": "v0",
        "name": "initial speed",
        "kind": "velocity",
        "symbol": "v_0"
      },
      {
        "id": "alpha",
        "name": "upward launch angle",
        "kind": "angle",
        "symbol": "\\alpha"
      },
      {
        "id": "g",
        "name": "gravitational acceleration",
        "kind": "acceleration",
        "symbol": "g"
      }
    ],
    "rules": {
      "t": "\\frac{[[v0]]\\cdot\\sin[[alpha]]}{[[g]]}",
      "v0": "\\frac{[[g]]\\cdot[[t]]}{\\sin[[alpha]]}",
      "alpha": "\\arcsin\\!\\left(\\frac{[[g]]\\cdot[[t]]}{[[v0]]}\\right)",
      "g": "\\frac{[[v0]]\\cdot\\sin[[alpha]]}{[[t]]}"
    },
    "outputs": [],
    "assumption": "Uniform gravity and no drag; an upward launch reaches its apex when the vertical velocity becomes zero. This time is half the equal-height return time.",
    "source": "Formelbuch",
    "pages": [
      52
    ],
    "reference": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion"
  },
  {
    "id": "book-real-magnification-distance",
    "topic": "optical-imaging",
    "title": "Real-Image Magnification from Distances",
    "fields": [
      {
        "id": "m",
        "name": "real-image magnification magnitude",
        "kind": "dimensionless",
        "symbol": "m"
      },
      {
        "id": "b",
        "name": "real image distance",
        "kind": "length",
        "symbol": "b"
      },
      {
        "id": "g",
        "name": "object distance",
        "kind": "length",
        "symbol": "g"
      }
    ],
    "rules": {
      "m": "\\frac{[[b]]}{[[g]]}",
      "b": "[[m]]\\cdot[[g]]",
      "g": "\\frac{[[b]]}{[[m]]}"
    },
    "outputs": [],
    "assumption": "Positive size ratio m = b/g for a real object and real inverted image. Signed transverse magnification is −m.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  },
  {
    "id": "book-image-focal-sizes",
    "topic": "optical-imaging",
    "title": "Focal Length from Image Size and Distance",
    "fields": [
      {
        "id": "f",
        "name": "positive focal length",
        "kind": "length",
        "symbol": "f"
      },
      {
        "id": "b",
        "name": "real image distance",
        "kind": "length",
        "symbol": "b"
      },
      {
        "id": "B",
        "name": "image-size magnitude",
        "kind": "length",
        "symbol": "B"
      },
      {
        "id": "G",
        "name": "object-size magnitude",
        "kind": "length",
        "symbol": "G"
      }
    ],
    "rules": {
      "f": "\\frac{[[b]]\\cdot[[G]]}{[[B]]+[[G]]}",
      "b": "[[f]]\\cdot\\left(1+\\frac{[[B]]}{[[G]]}\\right)",
      "B": "\\frac{[[G]]\\cdot([[b]]-[[f]])}{[[f]]}",
      "G": "\\frac{[[B]]\\cdot[[f]]}{[[b]]-[[f]]}"
    },
    "outputs": [],
    "assumption": "Converging thin lens and real-image size magnitudes. This directly covers G/B = f/(b−f) without first calculating magnification.",
    "source": "Formelbuch",
    "pages": [
      63
    ],
    "reference": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses"
  }
];
