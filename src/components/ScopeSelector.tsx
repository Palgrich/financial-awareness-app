import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useStore } from '../state/store';

interface ScopeSelectorProps {
  dark?: boolean;
}

export function ScopeSelector({ dark }: ScopeSelectorProps) {
  const institutions = useStore((s) => s.institutions);
  const accounts = useStore((s) => s.accounts);
  const selectedInstitutionId = useStore((s) => s.selectedInstitutionId);
  const setSelectedInstitutionId = useStore((s) => s.setSelectedInstitutionId);
  const [modalVisible, setModalVisible] = useState(false);

  const label =
    selectedInstitutionId === null
      ? `All accounts (${institutions.length} banks)`
      : (() => {
          const inst = institutions.find((i) => i.id === selectedInstitutionId);
          const count = accounts.filter((a) => a.institutionId === selectedInstitutionId).length;
          return inst ? `${inst.name} (${count} account${count !== 1 ? 's' : ''})` : 'All accounts';
        })();

  const bg = dark ? '#1e293b' : '#ffffff';
  const borderColor = dark ? '#475569' : '#e2e8f0';
  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';
  const modalBg = dark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)';
  const optionBg = dark ? '#1e293b' : '#ffffff';

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: bg, borderColor }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerLabel, { color: mutedColor }]}>Scope</Text>
        <Text style={[styles.triggerValue, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.chevron, { color: mutedColor }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: modalBg }]} onPress={() => setModalVisible(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: optionBg }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Show data for</Text>
            <TouchableOpacity
              style={[styles.option, selectedInstitutionId === null && styles.optionSelected]}
              onPress={() => {
                setSelectedInstitutionId(null);
                setModalVisible(false);
              }}
            >
              <Text style={[styles.optionText, { color: textColor }]}>
                All accounts ({institutions.length} banks)
              </Text>
            </TouchableOpacity>
            {institutions.map((inst) => {
              const accountCount = accounts.filter((a) => a.institutionId === inst.id).length;
              return (
                <TouchableOpacity
                  key={inst.id}
                  style={[styles.option, selectedInstitutionId === inst.id && styles.optionSelected]}
                  onPress={() => {
                    setSelectedInstitutionId(inst.id);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {inst.name} ({accountCount} account{accountCount !== 1 ? 's' : ''})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  triggerLabel: {
    fontSize: 12,
  },
  triggerValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  chevron: {
    fontSize: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    maxWidth: 320,
    width: '100%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    color: '#64748b',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
