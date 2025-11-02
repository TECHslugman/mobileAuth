// app/Dashboard.jsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Easing } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  bg: '#F6F9FC',
  headerText: '#87A1C5',
  accent: '#769FCD',
  cardBg: '#FFFFFF',
  cardBorder: '#E6EEF7',
  inputBg: '#F7FBFC',
  inputBorder: '#D6E6F2',
  text: '#1E1E1E',
  textMuted: '#7B7B7B',
  link: '#9AA7BC',
};

const bodhi5 = require('../assets/agencies/bodhi5.png');
const eduPro = require('../assets/agencies/edupro.png');
const yarab = require('../assets/agencies/yarab.png');
const globalreach = require('../assets/agencies/globalreach.png');

const INITIAL_AGENCIES = [
  {
    id: 'bodhi5',
    name: 'BODHI5',
    subtitle: 'Education Consultancy & Placement Firm',
    image: bodhi5,
    blurb:
      'Bodhi5 Education Consultancy and Placement Firm was founded by a group of like‑minded friends who have studied in Australia…',
  },
  {
    id: 'educationpro',
    name: 'EducationPro',
    subtitle: 'Your Door to the Future',
    image: eduPro,
    imageUri: '',
    blurb:
      'Application strategy, SOP review and scholarship insights with a curated partner network…',
  },
  {
    id: 'yarab',
    name: 'YARAB GLOBAL',
    subtitle: 'Education Consultancy & Placement Firm',
    image: yarab,
    blurb:
      'Road‑mapped timelines, test prep alignment and visa coaching tailored to your targets…',
  },
  {
    id: 'globalreach',
    name: 'GLOBAL REACH',
    subtitle: 'Education matters',
    image: globalreach,
    blurb:
      'Transparent guidance with strong placement outcomes across institutions…',
  },
];

const CARD_HEIGHT = 172;

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [agencies] = useState(INITIAL_AGENCIES);

  // Selection + flip state for one card at a time
  const [selectedId, setSelectedId] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Per-card Animated values
  const flipRefs = useRef({});
  const scaleRefs = useRef({});
  const getFlip = (id) => {
    if (!flipRefs.current[id]) flipRefs.current[id] = new Animated.Value(0);
    return flipRefs.current[id];
  };
  const getScale = (id) => {
    if (!scaleRefs.current[id]) scaleRefs.current[id] = new Animated.Value(1);
    return scaleRefs.current[id];
  };

  // Filter sheet animation (UI only; preserves your data as-is)
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open
  const overlayOpacity = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] });
  const sheetTranslateX = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH, 0] });

  const openSheet = () => {
    setSheetOpen(true);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 240,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => finished && setSheetOpen(false));
  };

  // Chevron animations per row (collapsed UI like screenshot)
  const rowChevron = {
    country: useRef(new Animated.Value(0)).current,
    level: useRef(new Animated.Value(0)).current,
    city: useRef(new Animated.Value(0)).current,
    rec: useRef(new Animated.Value(0)).current,
  };
  const rowOpen = useRef({ country: false, level: false, city: false, rec: false }).current;
  const toggleRow = (key) => {
    rowOpen[key] = !rowOpen[key];
    Animated.timing(rowChevron[key], {
      toValue: rowOpen[key] ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };
  const chevronRotate = (v) =>
    v.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] });

  // Derived list (kept to your original search behavior)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return agencies;
    return agencies.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.subtitle || '').toLowerCase().includes(q)
    );
  }, [query, agencies]);

  const animateHover = (id, to) => {
    Animated.spring(getScale(id), {
      toValue: to,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    }).start();
  };

  const flipTo = (id, to) => {
    Animated.timing(getFlip(id), {
      toValue: to,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const onCardPress = (id) => {
    if (selectedId === null) {
      setSelectedId(id);
      setIsFlipped(false);
      getFlip(id).setValue(0);
      animateHover(id, 1.02);
      return;
    }
    if (selectedId !== id) {
      flipTo(selectedId, 0);
      animateHover(selectedId, 1);
      setSelectedId(id);
      setIsFlipped(false);
      getFlip(id).setValue(0);
      animateHover(id, 1.02);
      return;
    }
    if (!isFlipped) {
      setIsFlipped(true);
      flipTo(id, 1);
    } else {
      setIsFlipped(false);
      flipTo(id, 0);
    }
  };

  const handleLearnMore = (id) => {
    router.push({ pathname: '/agency/[id]', params: { id } });
  };

  const Front = ({ item }) => {
    const source = item.imageUri ? { uri: item.imageUri } : item.image;
    return (
      <View style={styles.frontFill}>
        {source ? (
          <Image source={source} style={styles.fullImage} resizeMode="contain" />
        ) : (
          <View style={styles.fullImage} />
        )}
      </View>
    );
  };

  const Back = ({ item }) => (
    <View style={styles.backWrap}>
      <Text style={styles.blurbTitle}>{item.name} ECPF</Text>
      <Text numberOfLines={3} style={styles.blurbText}>{item.blurb}</Text>
      <TouchableOpacity onPress={() => handleLearnMore(item.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Text style={styles.learnMore}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedId === item.id;
    const flip = getFlip(item.id);
    const scale = getScale(item.id);

    const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
    const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
    const frontOpacity = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] });
    const backOpacity = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });

    return (
      <Pressable onPress={() => onCardPress(item.id)}>
        <Animated.View
          style={[
            styles.card,
            isSelected && styles.cardSelected,
            { transform: [{ scale: isSelected ? scale : 1 }] },
          ]}
        >
          <View style={styles.cardInner}>
            <Animated.View
              pointerEvents={isSelected && isFlipped ? 'none' : 'auto'}
              style={[
                styles.face,
                {
                  opacity: isSelected ? frontOpacity : 1,
                  transform: [{ perspective: 1000 }, { rotateY: isSelected ? frontRotate : '0deg' }],
                },
              ]}
            >
              <Front item={item} />
            </Animated.View>

            <Animated.View
              pointerEvents={isSelected && isFlipped ? 'auto' : 'none'}
              style={[
                styles.face,
                {
                  opacity: isSelected ? backOpacity : 0,
                  transform: [{ perspective: 1000 }, { rotateY: isSelected ? backRotate : '180deg' }],
                },
              ]}
            >
              <Back item={item} />
            </Animated.View>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  const FilterRow = ({ iconName, label, animKey }) => (
    <TouchableOpacity
      onPress={() => toggleRow(animKey)}
      style={styles.filterRow}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Feather name={iconName} size={16} color={COLORS.accent} />
        <Text style={styles.filterRowText}>{label}</Text>
      </View>
      <Animated.View style={{ transform: [{ rotate: chevronRotate(rowChevron[animKey]) }] }}>
        <Feather name="chevron-down" size={18} color="#6B7280" />
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <Text style={styles.headerTitle}>
          Choose an Agency before{'\n'}proceeding with your application.
        </Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={openSheet}>
            <Feather name="sliders" size={18} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 8 }} />}
      />

      {/* Dim overlay */}
      {sheetOpen && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={{ flex: 1 }} onPress={closeSheet} />
        </Animated.View>
      )}

      {/* Right filter sheet (compact, like screenshot) */}
      {sheetOpen && (
        <Animated.View
          style={[
            styles.sheet,
            { paddingTop: Math.max(insets.top + 6, 12), transform: [{ translateX: sheetTranslateX }] },
          ]}
        >
          {/* Top bar: back, centered title */}
          <View style={styles.sheetTopRow}>
            <TouchableOpacity onPress={closeSheet} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="chevron-left" size={22} color="#52606B" />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>Filter</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Search + Filter pill */}
          <View style={styles.sheetSearchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search"
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={styles.sheetApply} onPress={closeSheet}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Clear all link */}
          <TouchableOpacity onPress={closeSheet} style={{ alignSelf: 'flex-end', marginBottom: 8 }} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Text style={styles.clearAll}>Clear all</Text>
          </TouchableOpacity>

          {/* Four compact rows (collapsed) */}
          <FilterRow iconName="globe" label="Australia" animKey="country" />
          <FilterRow iconName="book-open" label={"Bachelor's (UG)"} animKey="level" />
          <FilterRow iconName="map-pin" label="Thimphu" animKey="city" />
          <FilterRow iconName="star" label="Top Recommended" animKey="rec" />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  headerTitle: {
    textAlign: 'center',
    color: COLORS.headerText,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 21,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, color: COLORS.text },
  filterBtn: {
    height: 42,
    width: 52,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: { padding: 16, paddingBottom: 18 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 14,
    overflow: 'hidden',
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardInner: {
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  face: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: CARD_HEIGHT,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  frontFill: { width: '100%', height: '100%' },
  fullImage: { width: '100%', height: '100%' },

  backWrap: {
    width: '100%',
    height: '100%',
    padding: 45,
  },
  blurbTitle: { color: COLORS.accent, fontWeight: '700', marginBottom: 6 },
  blurbText: { color: COLORS.text, fontSize: 13, lineHeight: 18 },
  learnMore: { marginRight: 0, marginTop: 20, alignSelf: 'flex-end', color: COLORS.link, fontWeight: '700', fontSize: 12 },

  // Overlay + sheet
  overlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: '#000',
  },
  sheet: {
    position: 'absolute',
    right: 0, top: 0, bottom: 0,
    width: Math.min(SCREEN_WIDTH * 0.9, 380),
    backgroundColor: '#F7FBFF',
    borderLeftWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 14,
  },
  sheetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backBtn: {
    height: 32, width: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#EDF2FF',
  },
  sheetTitle: { color: COLORS.headerText, fontWeight: '700' },

  sheetSearchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  sheetApply: {
    height: 42, paddingHorizontal: 16, borderRadius: 21,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },
  clearAll: { color: '#9AA7BC', fontWeight: '700', fontSize: 12 },

  // Compact rows (collapsed)
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  filterRowText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
});
