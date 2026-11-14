import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A 20 px checkbox mark, as on the join cards: brand with a white tick when checked. */
export function CheckBox({ checked }: { checked: boolean }) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.box,
        checked
          ? { backgroundColor: theme.brand, borderColor: theme.brand }
          : { backgroundColor: theme.card, borderColor: theme.strokeStrong },
      ]}>
      {checked && <Icon name="tick" size={14} color="textOnBrand" strokeWidth={3} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.check,
  },
});
