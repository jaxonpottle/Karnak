import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';

const pipelineStages = [
  'Arrived from Auction',
  'Inspected',
  'Cleaned',
  'Mechanical Repair',
  'Detail / Body Work',
  'Ready for Sale',
  'Sold',
];

const quickIssueLibrary = [
  'Check engine light',
  'Oil leak',
  'Brake pads',
  'Tire tread low',
  'Windshield chip',
  'Detailing needed',
  'Battery replace',
  'Alignment',
];

const mockVehicles = [
  {
    id: 'KAR-00123',
    vin: '1HGCM82633A004352',
    title: '2019 Toyota Camry SE',
    stage: 'Mechanical Repair',
    priority: 'High',
    assignee: 'J. Ramirez',
    notes: 'Transmission check + rear brake service.',
    issues: ['Brake pads', 'Alignment'],
  },
  {
    id: 'KAR-00124',
    vin: '5N1AT2MV7GC881204',
    title: '2017 Nissan Rogue SV',
    stage: 'Detail / Body Work',
    priority: 'Medium',
    assignee: 'Detail Team',
    notes: 'Interior stain removal + polish.',
    issues: ['Detailing needed', 'Windshield chip'],
  },
  {
    id: 'KAR-00125',
    vin: '3CZRU6H57GM735218',
    title: '2016 Honda HR-V EX',
    stage: 'Ready for Sale',
    priority: 'Low',
    assignee: 'Sales Desk',
    notes: 'Photography scheduled for today.',
    issues: ['Tire tread low'],
  },
];

const partsSuggestions = [
  {
    part: 'Front brake pads (Camry SE)',
    vendors: [
      { name: 'AutoParts Direct', price: '$52.90', eta: '2 days' },
      { name: 'BrakePro Supply', price: '$55.40', eta: 'Next day' },
      { name: 'ValueParts Online', price: '$57.10', eta: '3 days' },
      { name: 'PartsHub', price: '$59.00', eta: '2 days' },
      { name: 'OEM Express', price: '$62.25', eta: 'Next day' },
    ],
  },
  {
    part: 'Windshield repair kit',
    vendors: [
      { name: 'GlassFix', price: '$18.95', eta: '1 day' },
      { name: 'QuickParts', price: '$19.10', eta: '2 days' },
      { name: 'RepairZone', price: '$19.75', eta: '2 days' },
      { name: 'AutoParts Direct', price: '$21.00', eta: '3 days' },
      { name: 'GlassPro', price: '$22.15', eta: 'Next day' },
    ],
  },
];

const staffUpdates = [
  {
    name: 'Marisol (Inspection)',
    update:
      'Inspected VIN 1HGCM82633A004352, noted brake wear and alignment drift.',
    time: '9:18 AM',
  },
  {
    name: 'Devon (Detail)',
    update: 'Interior steam clean finished on Rogue SV, paint correction queued.',
    time: '10:02 AM',
  },
  {
    name: 'Avery (Sales)',
    update: 'Photos scheduled + pricing draft for HR-V EX.',
    time: '10:45 AM',
  },
];

export default function PipelineDashboard() {
  const [issueDraft, setIssueDraft] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([
    'Brake pads',
  ]);
  const [noteDraft, setNoteDraft] = useState('');

  const issueSuggestions = useMemo(() => {
    if (!issueDraft.trim()) {
      return quickIssueLibrary;
    }
    return quickIssueLibrary.filter((issue) =>
      issue.toLowerCase().includes(issueDraft.toLowerCase())
    );
  }, [issueDraft]);

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue]
    );
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Karnak AutoOps Suite</Text>
          <Text style={styles.title}>Used Car Pipeline Control Center</Text>
          <Text style={styles.subtitle}>
            Track every vehicle from auction arrival through sale with live
            updates, shared notes, and automated sourcing.
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add New Vehicle</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Scan VIN</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pipeline Overview</Text>
        <View style={styles.stageGrid}>
          {pipelineStages.map((stage, index) => (
            <View key={stage} style={styles.stageCard}>
              <Text style={styles.stageIndex}>0{index + 1}</Text>
              <Text style={styles.stageName}>{stage}</Text>
              <Text style={styles.stageMeta}>4 vehicles • 2 overdue</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Active Vehicles</Text>
          <Text style={styles.sectionHint}>Team-wide updates in real time</Text>
        </View>
        {mockVehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleHeader}>
              <View>
                <Text style={styles.vehicleTitle}>{vehicle.title}</Text>
                <Text style={styles.vehicleMeta}>
                  Stock #{vehicle.id} • VIN {vehicle.vin}
                </Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{vehicle.stage}</Text>
              </View>
            </View>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleDetailItem}>
                Priority: {vehicle.priority}
              </Text>
              <Text style={styles.vehicleDetailItem}>
                Owner: {vehicle.assignee}
              </Text>
            </View>
            <Text style={styles.vehicleNotes}>{vehicle.notes}</Text>
            <View style={styles.issueRow}>
              {vehicle.issues.map((issue) => (
                <View key={issue} style={styles.issueChip}>
                  <Text style={styles.issueChipText}>{issue}</Text>
                </View>
              ))}
            </View>
            <View style={styles.vehicleActions}>
              <Pressable style={styles.secondaryButtonSmall}>
                <Text style={styles.secondaryButtonText}>Update Stage</Text>
              </Pressable>
              <Pressable style={styles.secondaryButtonSmall}>
                <Text style={styles.secondaryButtonText}>Add Note</Text>
              </Pressable>
              <Pressable style={styles.secondaryButtonSmall}>
                <Text style={styles.secondaryButtonText}>Assign</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionSplit}>
          <View style={styles.splitColumn}>
            <Text style={styles.sectionTitle}>Quick Issue Log</Text>
            <Text style={styles.sectionHint}>
              Tap to add common issues or type to search and save.
            </Text>
            <TextInput
              placeholder="Search or add new issue"
              placeholderTextColor="#7E8A9A"
              style={styles.input}
              value={issueDraft}
              onChangeText={setIssueDraft}
            />
            <View style={styles.issueGrid}>
              {issueSuggestions.map((issue) => {
                const selected = selectedIssues.includes(issue);
                return (
                  <Pressable
                    key={issue}
                    style={[
                      styles.issueSelectChip,
                      selected && styles.issueSelectChipActive,
                    ]}
                    onPress={() => toggleIssue(issue)}
                  >
                    <Text
                      style={[
                        styles.issueSelectText,
                        selected && styles.issueSelectTextActive,
                      ]}
                    >
                      {issue}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.selectionSummary}>
              <Text style={styles.selectionTitle}>Selected Issues</Text>
              <Text style={styles.selectionBody}>
                {selectedIssues.length
                  ? selectedIssues.join(', ')
                  : 'Nothing selected yet.'}
              </Text>
            </View>
          </View>
          <View style={styles.splitColumn}>
            <Text style={styles.sectionTitle}>Mechanic Notes</Text>
            <Text style={styles.sectionHint}>
              Centralized updates for technicians, body shop, and detail teams.
            </Text>
            <TextInput
              placeholder="Add a note for the current vehicle"
              placeholderTextColor="#7E8A9A"
              style={[styles.input, styles.textarea]}
              multiline
              value={noteDraft}
              onChangeText={setNoteDraft}
            />
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Save Note</Text>
            </Pressable>
            <View style={styles.noteList}>
              {staffUpdates.map((update) => (
                <View key={update.time} style={styles.noteCard}>
                  <Text style={styles.noteTitle}>{update.name}</Text>
                  <Text style={styles.noteBody}>{update.update}</Text>
                  <Text style={styles.noteTime}>{update.time}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parts & Pricing Intelligence</Text>
        <Text style={styles.sectionHint}>
          Auto-compare five lowest online options when a part is flagged.
        </Text>
        {partsSuggestions.map((part) => (
          <View key={part.part} style={styles.partsCard}>
            <Text style={styles.partsTitle}>{part.part}</Text>
            {part.vendors.map((vendor) => (
              <View key={vendor.name} style={styles.vendorRow}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorMeta}>
                  {vendor.price} • {vendor.eta}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connected Owner Sites</Text>
        <Text style={styles.sectionHint}>
          Pull photos, pricing, and descriptions from dealer websites to sync
          listings instantly.
        </Text>
        <View style={styles.integrationsGrid}>
          {['Dealer site sync', 'Photo CDN', 'Marketplace feeds'].map(
            (item) => (
              <View key={item} style={styles.integrationCard}>
                <Text style={styles.integrationTitle}>{item}</Text>
                <Text style={styles.integrationBody}>
                  Ready to connect • Last updated 2 hours ago
                </Text>
                <Pressable style={styles.secondaryButtonSmall}>
                  <Text style={styles.secondaryButtonText}>Configure</Text>
                </Pressable>
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Next steps</Text>
        <Text style={styles.footerBody}>
          Invite team members, connect your listing sources, and set custom
          pipeline stages for every store in your group.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0B1118',
  },
  pageContent: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  eyebrow: {
    color: '#8FA4BF',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    fontSize: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F7FA',
    marginBottom: 8,
  },
  subtitle: {
    maxWidth: 520,
    color: '#B6C2D2',
    fontSize: 15,
    lineHeight: 22,
  },
  headerActions: {
    justifyContent: 'center',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2F80ED',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F5F7FA',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2F80ED',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonSmall: {
    borderWidth: 1,
    borderColor: '#2A3A4F',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#B6C2D2',
    fontWeight: '600',
    fontSize: 13,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F5F7FA',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionHint: {
    color: '#8FA4BF',
    fontSize: 13,
    maxWidth: 560,
    marginBottom: 16,
  },
  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stageCard: {
    backgroundColor: '#121B24',
    borderRadius: 16,
    padding: 16,
    width: 170,
  },
  stageIndex: {
    color: '#2F80ED',
    fontWeight: '700',
    marginBottom: 6,
  },
  stageName: {
    color: '#F5F7FA',
    fontWeight: '600',
    marginBottom: 8,
  },
  stageMeta: {
    color: '#8FA4BF',
    fontSize: 12,
  },
  vehicleCard: {
    backgroundColor: '#121B24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  vehicleTitle: {
    color: '#F5F7FA',
    fontWeight: '700',
    fontSize: 16,
  },
  vehicleMeta: {
    color: '#8FA4BF',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#1B2A3A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#9CC3FF',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  vehicleDetailItem: {
    color: '#D0D8E2',
    fontSize: 13,
  },
  vehicleNotes: {
    color: '#B6C2D2',
    marginTop: 12,
    lineHeight: 20,
  },
  issueRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  issueChip: {
    backgroundColor: '#223344',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  issueChipText: {
    color: '#A9BCD0',
    fontSize: 12,
  },
  vehicleActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  sectionSplit: {
    flexDirection: 'row',
    gap: 24,
    flexWrap: 'wrap',
  },
  splitColumn: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#121B24',
    borderRadius: 18,
    padding: 18,
  },
  input: {
    backgroundColor: '#0E1620',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#1F2B3A',
    marginBottom: 12,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  issueSelectChip: {
    borderWidth: 1,
    borderColor: '#2A3A4F',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  issueSelectChipActive: {
    backgroundColor: '#2F80ED',
    borderColor: '#2F80ED',
  },
  issueSelectText: {
    color: '#B6C2D2',
    fontSize: 12,
  },
  issueSelectTextActive: {
    color: '#F5F7FA',
    fontWeight: '600',
  },
  selectionSummary: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#0E1620',
    borderRadius: 12,
  },
  selectionTitle: {
    color: '#9CC3FF',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  selectionBody: {
    color: '#D0D8E2',
    fontSize: 13,
  },
  noteList: {
    marginTop: 16,
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#0E1620',
    padding: 12,
    borderRadius: 12,
  },
  noteTitle: {
    color: '#F5F7FA',
    fontWeight: '600',
    marginBottom: 4,
  },
  noteBody: {
    color: '#B6C2D2',
    fontSize: 13,
    lineHeight: 18,
  },
  noteTime: {
    color: '#8FA4BF',
    fontSize: 11,
    marginTop: 6,
  },
  partsCard: {
    backgroundColor: '#121B24',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  partsTitle: {
    color: '#F5F7FA',
    fontWeight: '600',
    marginBottom: 12,
  },
  vendorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  vendorName: {
    color: '#D0D8E2',
    fontSize: 13,
  },
  vendorMeta: {
    color: '#8FA4BF',
    fontSize: 12,
  },
  integrationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  integrationCard: {
    backgroundColor: '#121B24',
    borderRadius: 16,
    padding: 16,
    minWidth: 220,
    flex: 1,
  },
  integrationTitle: {
    color: '#F5F7FA',
    fontWeight: '600',
    marginBottom: 6,
  },
  integrationBody: {
    color: '#8FA4BF',
    fontSize: 12,
    marginBottom: 12,
  },
  footer: {
    backgroundColor: '#121B24',
    borderRadius: 20,
    padding: 20,
  },
  footerTitle: {
    color: '#F5F7FA',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  footerBody: {
    color: '#B6C2D2',
    lineHeight: 20,
  },
});
