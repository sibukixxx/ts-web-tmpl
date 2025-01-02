const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        xs: '375px',
        'md-lg': '960px',
        '2xl': '1440px',
      },

      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
      },

      lineHeight: {
        4.5: '1.125rem',
        5.5: '1.375rem',
      },
      boxShadow: {
        '3xl':
          '0px 48px 64px -36px rgba(49, 51, 63, 0.13), 0px 24px 48px -8px rgba(49, 51, 63, 0.11)',
        dialog: '0px 2px 6px rgba(33, 34, 37, 0.06), 0px 32px 41px -23px rgba(33, 34, 37, 0.07)',
        dropdown: '0px 2px 4px -2px rgba(49, 51, 63, 0.06), 0px 4px 8px -2px rgba(49, 51, 63, 0.1)',
        'carousel-button-light':
          '0px 1px 3px 0px rgba(33, 42, 131, 0.10), 0px 6px 6px 0px rgba(33, 42, 131, 0.09), -1px 13px 8px 0px rgba(33, 42, 131, 0.05), -2px 22px 9px 0px rgba(33, 42, 131, 0.01), -3px 35px 10px 0px rgba(33, 42, 131, 0.00)',
        'carousel-button-dark': '0px 15px 35px 0px rgba(18, 18, 19, 0.40)',
      },

      opacity: {
        15: '.15',
      },

      outlineWidth: {
        3: '3px',
      },

      width: {
        1.25: '0.313rem',
        15: '3.75rem',
        25: '6.25rem',
        28.5: '7.125rem',
        30: '7.5rem',
      },

      minWidth: {
        md: '28rem',
      },

      maxWidth: {
        'site-content': '90rem',
        content: '86rem',
        23: '5.75rem',
        32: '8rem',
        36: '9rem',
      },

      height: {
        1.25: '0.313rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        15: '3.75rem',
        21: '5.25rem',
        30: '7.5rem',
        50: '12.5rem',
      },

      margin: {
        px: '1px',
      },

      rounded: {
        '3xl': '1.25rem',
      },

      backgroundSize: {
        500: '500px',
        1000: '1000px',
        '200%': '200%',
      },

      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: 0,
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
}
