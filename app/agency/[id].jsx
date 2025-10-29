// app/agency/[id].jsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  bg: '#F6F9FC',
  primary: '#538DFE',
  accent: '#769FCD',
  heading: '#87A1C5',
  cardBg: '#FFFFFF',
  cardBorder: '#E6EEF7',
  pillBg: '#F7FBFC',
  text: '#2E2E2E',
};

// Example local assets (ensure these files exist or replace with your own)
const bodhi5 = require('../../assets/agencies/bodhi5.png');          // hero/banner image
const ecuLogo = require('../../assets/partners/ecu.png');            // partner logo
const sheridanLogo = require('../../assets/partners/sheridan.png');  // partner logo

// Data mock; replace or hydrate from API later
const MOCK = {
  bodhi5: {
    name: 'Bodhi5 ECPF',
    est: '2019',
    address:
      'Level 3, Multi-level Car Park\nHongkong Market, Thimphu Bhutan',
    about:
      'We strive to offer customer-centric support and services to aspiring students and their dependents who wish to study in Australia. We offer reliable and trusted services throughout the application’s journey from consultation to enrollment.',
    services: [
      'Free Consultation',
      'Course & University Selection',
      'Enrollment',
      'Visa Application',
      'Post-arrival Support',
    ],
    process: [
      'Consultation',
      'Selection of course, institute and campus',
      'Support in English course (AEP) if required',
      'Obtain Offer Letter',
      'Confirmation of Enrollment',
      'Student Health Cover (applicant & dependents)',
      'Documentation for visa',
      'Visa processing',
      'Pre-departure session',
      'Reception at airport in Australia',
      'Accommodation & settling support',
      'University/Institute orientation',
      'Assist to get part-time jobs',
      'Post-graduation study & visa options',
    ],
    partners: [
      { name: 'ECU', image: ecuLogo, imageUri: '' },
      { name: 'Sheridan', image: sheridanLogo, imageUri: '' },
    ],
    hero: bodhi5,
    heroUri: '',
  },
};

function Dot() {
  return <View style={styles.dot} />;
}

export default function AgencyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const data = useMemo(() => (MOCK[id] ? MOCK[id] : MOCK.bodhi5), [id]);

  const heroSource = data.heroUri ? { uri: data.heroUri } : data.hero;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color="#52606B" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{data.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.heroCard}>
          {heroSource ? (
            <Image
              source={heroSource}
              style={styles.heroImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: '#F1F6FF' }]} />
          )}
          <View style={styles.heroDivider} />
        </View>

        {/* Meta */}
        <View style={styles.dividerRow}>
          <Text style={styles.estText}>EST. {data.est}</Text>
        </View>

        <View style={styles.block}>
          <View style={styles.locationPill}>
            <Feather name="map-pin" size={14} color={COLORS.accent} />
            <Text style={styles.locationText}>{data.address}</Text>
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>{data.about}</Text>
        </View>

        {/* Services */}
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.card}>
          {data.services.map((s, idx) => (
            <View key={String(idx)} style={styles.serviceRow}>
              <Feather name="check-circle" size={16} color={COLORS.accent} />
              <Text style={styles.serviceText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Process */}
        <Text style={styles.sectionTitle}>Process</Text>
        <View style={styles.card}>
          {data.process.map((p, idx) => (
            <View key={String(idx)} style={styles.processRow}>
              <Dot />
              <Text style={styles.processText}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Partners with images */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleNoMargin}>Our Partners</Text>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Text style={styles.viewMore}>View more</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.partnersRow}
        >
          {data.partners.map((p, idx) => {
            const partnerSource = p.imageUri ? { uri: p.imageUri } : p.image;
            return (
              <View key={String(idx)} style={styles.partnerTile}>
                {partnerSource ? (
                  <Image
                    source={partnerSource}
                    style={styles.partnerLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.partnerText}>{p.name}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Spacer so bottom button doesn’t cover content */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Select button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.selectBtn} onPress={() => {}}>
          <Text style={styles.selectText}>SELECT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const HERO_HEIGHT = 120;

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
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F6FF',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.heading,
    fontWeight: '600',
  },

  scrollBody: { padding: 16 },

  heroCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
  heroImage: {
    width: '100%',
    height: HERO_HEIGHT,
    alignSelf: 'center',
  },
  heroDivider: {
    marginTop: 10,
    height: 1,
    backgroundColor: '#E5EAF1',
  },

  dividerRow: {
    marginVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E5EAF1',
    paddingTop: 8,
  },
  estText: { fontSize: 12, color: '#8696AA' },

  block: { marginBottom: 8 },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.pillBg,
    borderWidth: 1,
    borderColor: '#EAF2FC',
    borderRadius: 10,
    padding: 10,
  },
  locationText: { flex: 1, color: COLORS.text, fontSize: 12, lineHeight: 18 },

  sectionHeaderRow: {
    marginTop: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { marginTop: 12, marginBottom: 6, color: COLORS.accent, fontWeight: '700' },
  sectionTitleNoMargin: { color: COLORS.accent, fontWeight: '700' },
  viewMore: { color: '#9AA7BC', fontWeight: '700', fontSize: 12 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 12,
    marginBottom: 12,
  },
  cardText: { color: COLORS.text, fontSize: 13, lineHeight: 19 },

  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  serviceText: { color: COLORS.text, fontSize: 13 },

  processRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  dot: { marginTop: 3, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  processText: { flex: 1, color: COLORS.text, fontSize: 13, lineHeight: 18 },

  partnersRow: { paddingRight: 4 },
  partnerTile: {
    height: 80,
    width: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    padding: 8,
  },
  partnerLogo: { width: '100%', height: '100%' },
  partnerText: { color: '#2A2A2A', fontWeight: '700' },

  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  selectBtn: {
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
