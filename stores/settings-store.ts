import { create } from "zustand";
import {
  SMS_TEMPLATES,
  TEMPLATES,
  type CampaignTemplate,
  type SmsTemplate,
} from "@/data/campaigns";
import {
  COMPANY_PROFILE,
  DEFAULT_ROLE_PERMISSIONS,
  DEFAULT_ROLE_SCOPES,
  SENDER_SETTINGS,
  TEAM_MEMBERSHIPS,
  TEAM_SETTINGS,
  USERS,
  ZONE_SETTINGS,
  type AppUser,
  type CompanyProfile,
  type DataScope,
  type PermissionKey,
  type Role,
  type SenderSettings,
  type TeamSetting,
  type ZoneSetting,
} from "@/data/settings";

export const SETTINGS_TABS = [
  "empresa",
  "remetentes",
  "modelos",
  "equipas",
  "zonas",
  "acessos",
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number];

function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

type SettingsState = {
  tab: SettingsTab;
  company: CompanyProfile;
  senders: SenderSettings;
  emailTemplates: CampaignTemplate[];
  smsTemplates: SmsTemplate[];
  zones: ZoneSetting[];
  teams: TeamSetting[];
  memberships: Record<string, string>;
  rolePermissions: Record<Role, PermissionKey[]>;
  roleScopes: Record<Role, DataScope>;
  users: AppUser[];
  inviteOpen: boolean;
  setTab: (tab: SettingsTab) => void;
  saveCompany: (company: CompanyProfile) => void;
  saveSenders: (senders: SenderSettings) => void;
  saveEmailTemplate: (template: CampaignTemplate) => void;
  removeEmailTemplate: (id: string) => void;
  saveSmsTemplate: (template: SmsTemplate) => void;
  removeSmsTemplate: (id: string) => void;
  addZone: (zone: ZoneSetting) => void;
  updateZone: (name: string, patch: Partial<ZoneSetting>) => void;
  removeZone: (name: string) => void;
  addTeam: (name: string) => void;
  updateTeam: (id: string, patch: Partial<Omit<TeamSetting, "id">>) => void;
  removeTeam: (id: string) => void;
  setMembership: (ownerName: string, teamId: string) => void;
  togglePermission: (role: Role, key: PermissionKey) => void;
  setRoleScope: (role: Role, scope: DataScope) => void;
  setUserRole: (id: string, role: Role) => void;
  setInviteOpen: (open: boolean) => void;
  inviteUser: (user: Pick<AppUser, "name" | "email" | "role">) => void;
  removeUser: (id: string) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  tab: "empresa",
  company: COMPANY_PROFILE,
  senders: SENDER_SETTINGS,
  emailTemplates: TEMPLATES,
  smsTemplates: SMS_TEMPLATES,
  zones: ZONE_SETTINGS,
  teams: TEAM_SETTINGS,
  memberships: TEAM_MEMBERSHIPS,
  rolePermissions: DEFAULT_ROLE_PERMISSIONS,
  roleScopes: DEFAULT_ROLE_SCOPES,
  users: USERS,
  inviteOpen: false,

  setTab: (tab) => set({ tab }),
  saveCompany: (company) => set({ company }),
  saveSenders: (senders) => set({ senders }),

  saveEmailTemplate: (template) =>
    set((state) => ({
      emailTemplates: state.emailTemplates.some((item) => item.id === template.id)
        ? state.emailTemplates.map((item) => (item.id === template.id ? template : item))
        : [...state.emailTemplates, template],
    })),
  removeEmailTemplate: (id) =>
    set((state) => ({
      emailTemplates: state.emailTemplates.filter((item) => item.id !== id),
    })),
  saveSmsTemplate: (template) =>
    set((state) => ({
      smsTemplates: state.smsTemplates.some((item) => item.id === template.id)
        ? state.smsTemplates.map((item) => (item.id === template.id ? template : item))
        : [...state.smsTemplates, template],
    })),
  removeSmsTemplate: (id) =>
    set((state) => ({
      smsTemplates: state.smsTemplates.filter((item) => item.id !== id),
    })),

  addZone: (zone) => set((state) => ({ zones: [...state.zones, zone] })),
  updateZone: (name, patch) =>
    set((state) => ({
      zones: state.zones.map((zone) => (zone.name === name ? { ...zone, ...patch } : zone)),
    })),
  removeZone: (name) =>
    set((state) => ({ zones: state.zones.filter((zone) => zone.name !== name) })),

  addTeam: (name) =>
    set((state) => ({
      teams: [
        ...state.teams,
        {
          id: newId("equipa"),
          name,
          description: "",
          icon: "users",
          quota: 0,
          showInSidebar: true,
        },
      ],
    })),
  updateTeam: (id, patch) =>
    set((state) => ({
      teams: state.teams.map((team) => (team.id === id ? { ...team, ...patch } : team)),
    })),
  removeTeam: (id) =>
    set((state) =>
      Object.values(state.memberships).includes(id)
        ? state
        : { teams: state.teams.filter((team) => team.id !== id) },
    ),
  setMembership: (ownerName, teamId) =>
    set((state) => ({ memberships: { ...state.memberships, [ownerName]: teamId } })),

  togglePermission: (role, key) =>
    set((state) => {
      if (role === "Administrador") return state;
      const current = state.rolePermissions[role];
      return {
        rolePermissions: {
          ...state.rolePermissions,
          [role]: current.includes(key)
            ? current.filter((item) => item !== key)
            : [...current, key],
        },
      };
    }),
  setRoleScope: (role, scope) =>
    set((state) =>
      role === "Administrador"
        ? state
        : { roleScopes: { ...state.roleScopes, [role]: scope } },
    ),

  setUserRole: (id, role) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, role } : user)),
    })),
  setInviteOpen: (inviteOpen) => set({ inviteOpen }),
  inviteUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        { ...user, id: newId("user"), status: "Convite pendente" },
      ],
      inviteOpen: false,
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id || user.status !== "Convite pendente"),
    })),
}));
