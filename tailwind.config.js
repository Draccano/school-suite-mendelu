module.exports = {
  theme: {
    fontFamily: {
      'sans': ['-apple-system', 'BlinkMacSystemFont'],
      'serif': ['Georgia', 'Cambria'],
      'mono': ['SFMono-Regular', 'Menlo']
    },
    customForms: theme => ({
      default: {
        input: {
          borderColor: 'transparent',
          borderRadius: theme('borderRadius.lg'),
          backgroundColor: theme('colors.gray.700'),
          '&:focus': {
            backgroundColor: theme('colors.white')
          }
        },
        select: {
          borderRadius: theme('borderRadius.lg'),
          lineHeight: theme('lineHeight.snug'),
          icon:
            '<svg fill="#e2e8f0" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>',
          borderColor: 'transparent',
          backgroundColor: theme('colors.gray.700'),
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: 'none'
          }
        },
        checkbox: {
          width: theme('spacing.6'),
          height: theme('spacing.6'),
          backgroundColor: theme('colors.gray.900'),
          borderColor: 'transparent',
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: 'none'
          }
        },
        radio: {
          backgroundColor: theme('colors.gray.900'),
          borderColor: 'transparent'
        }, 
        textarea: {
          borderRadius: theme('borderRadius.lg'),
          lineHeight: theme('lineHeight.snug'),
          borderColor: 'transparent',
          backgroundColor: theme('colors.gray.700'),
          '&:focus': {
            borderColor: 'transparent',
            boxShadow: 'none'
          }
        }
      }
    }),
    extend: {}
  },
  variants: { 
  },

  plugins: [
  ],
}
