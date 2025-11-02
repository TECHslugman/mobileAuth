import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  bg: '#F6F9FC',
  heading: '#87A1C5',
  cardBg: '#FFFFFF',
  cardBorder: '#E6EEF7',
  text: '#2E2E2E',
};

// Keep your working asset paths as-is
const ecuLogo = require('../../../assets/partners/ecu.png');
const sheridanLogo = require('../../../assets/partners/sheridan.png');
const Stanley = require('../../../assets/partners/stanley.png');
const curtin = require('../../../assets/partners/curtin.png');
const uccollege = require('../../../assets/partners/uccollege.png');
const phoenix = require('../../../assets/partners/phoenix.png');

const FALLBACK_PARTNERS = [
  { name: 'ECU', image: ecuLogo, imageUri: '' },
  { name: 'Sheridan', image: sheridanLogo, imageUri: '' },
  { name: 'Stanley College', image: Stanley, imageUri: '' },
  { name: 'Curtin University', image: curtin, imageUri: '' },
  { name: 'UC College', image: uccollege, imageUri: '' },
  { name: 'Phoenix Academy', image: phoenix, imageUri: '' },
  { name: 'Phoenix Academy', image: phoenix, imageUri: '' },
  { name: 'Sheridan', image: sheridanLogo, imageUri: '' },
  { name: 'Stanley College', image: Stanley, imageUri: '' },
  { name: 'Curtin University', image: curtin, imageUri: '' },
  
];

export default function PartnersGrid() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();

  // Layout knobs
  const H_PADDING = 16;     // grid horizontal padding
  const COL_GAP = 12;       // space between columns
  const TOP_PAD = 12;       // grid top padding
  const BOT_PAD = 24;       // grid bottom padding
  const HEADER_EST = 56;    // approximate topBar height incl. SafeArea (tune if needed)
  const TILE_HEIGHT = 92;   // card height (keep in sync with styles.tile.height)

  // Exact tile width so columns fill the row without leftover space
  const tileWidth = Math.floor((width - (H_PADDING * 2) - COL_GAP) / 2);

  const partners = useMemo(() => FALLBACK_PARTNERS, [id]);

  // Compute vertical gap so rows “fill” the screen height
  const rows = Math.max(1, Math.ceil(partners.length / 2));
  const verticalPaddings = TOP_PAD + BOT_PAD + HEADER_EST;
  const usable = Math.max(0, height - verticalPaddings);
  const leftover = Math.max(0, usable - (rows * TILE_HEIGHT));
  // Distribute leftover height across gaps between rows; clamp to sane limits
  const computedRowGap = rows > 1 ? Math.floor(leftover / (rows - 1)) : 0;
  const ROW_GAP = Math.max(10, Math.min(computedRowGap, 28));

  const renderItem = ({ item, index }) => {
    const src = item.imageUri ? { uri: item.imageUri } : item.image;
    const isLeft = index % 2 === 0;
    return (
      <View
        style={[
          styles.tile,
          styles.tileShadow,
          {
            width: tileWidth,
            marginRight: isLeft ? COL_GAP : 0, // single center gutter
            marginBottom: ROW_GAP,             // vertical spacing between rows
          },
        ]}
      >
        {src ? (
          <Image source={src} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={styles.tileText}>{item.name}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color="#52606B" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Our Partners</Text>
        <View style={{ width: 22 }} />
      </View>

      <FlatList
        data={partners}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingTop: TOP_PAD, paddingBottom: BOT_PAD }}
        columnWrapperStyle={{ justifyContent: 'flex-start' }} // spacing handled by item margins
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        windowSize={5}
        maxToRenderPerBatch={8}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#EDEFF2',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    height: 32, width: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F2F6FF',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.heading,
    fontWeight: '600',
  },

  tile: {
    height: 92,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  tileShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  logo: { width: '100%', height: '100%' },
  tileText: { color: COLORS.text, fontWeight: '700' },
});
