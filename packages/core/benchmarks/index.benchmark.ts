import { createCss, createTokens, hotReloadingCache } from '../src';

describe('createCss', () => {
  test('create simple atoms', () => {
    const css = createCss({}, null);
    const atoms = css({ color: 'red' }) as any;
    const atom = atoms.atoms[0];

    const { styles } = css.getStyles(() => {
      expect(atom.toString()).toMatchInlineSnapshot(`"_vfarC"`);

      return '';
    });
  });

  test('compose atoms', () => {
    const css = createCss({}, null);
    css({ color: 'red', backgroundColor: 'blue' }).toString();
  });

  test('create tokens', () => {
    const tokens = createTokens({
      colors: {
        RED: 'tomato',
      },
    });
    const css = createCss({ tokens }, null);
    const atom = (css({ color: 'RED' }) as any).atoms[0];

    const { styles } = css.getStyles(() => {
      atom.toString();
      return '';
    });
  });
});
