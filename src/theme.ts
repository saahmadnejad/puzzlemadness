export const theme = {
  colors: {
    background: '#f4f5f7',
    surface: '#ffffff',
    border: '#c9ced6',
    borderBold: '#3a4150',
    text: '#1c2330',
    textMuted: '#7b8494',
    accent: '#2563eb',
    accentSoft: '#dbeafe',
    highlight: '#fff7cc',
    given: '#1c2330',
    user: '#2563eb',
    error: '#dc2626',
    errorSoft: '#fee2e2',
    success: '#16a34a',
    padKey: '#eef1f5',
    danger: '#fee2e2',
  },
  /**
   * Vazir covers Latin and Persian glyphs, so it is used for every language.
   * Bold is a separate family (Vazir-Bold.ttf), so bold text uses the bold
   * family with fontWeight 'normal' to avoid synthetic bolding.
   */
  fonts: {
    regular: 'Vazir-Regular',
    bold: 'Vazir-Bold',
  },
  fontSize: {
    cell: 22,
    note: 9,
    pad: 24,
  },
};
