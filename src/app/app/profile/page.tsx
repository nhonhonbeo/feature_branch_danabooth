"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactElement, type ReactNode } from "react";
import {
  Accessibility,
  Camera,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileLock2,
  Fingerprint,
  Globe,
  Lock,
  Map,
  QrCode,
  Shield,
  Star,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale } from "@/hooks/useLocale";
import { usePassportStore } from "@/features/passport/store";
import type { Account, FieldVisibility, ProfileSettings } from "@/types";

type ProfileForm = {
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  primaryEmail: string;
  secondaryEmail: string;
  profilePhotoUrl: string;
  preferredLanguage: "vi" | "en";
  timezone: string;
  locale: "vi" | "en";
  cropY: number;
};

const visibilityOptions: FieldVisibility[] = ["public", "connections", "private"];

export default function Profile() {
  const { locale } = useLocale();
  const passport = usePassportStore((s) => s.passport);
  const account = usePassportStore((s) => s.account);
  const profileSettings = usePassportStore((s) => s.profileSettings);
  const stamps = usePassportStore((s) => s.stamps);
  const documents = usePassportStore((s) => s.travelDocuments);
  const emergencyContacts = usePassportStore((s) => s.emergencyContacts);
  const medicalAlerts = usePassportStore((s) => s.medicalAlerts);
  const embassyContacts = usePassportStore((s) => s.embassyContacts);
  const sessions = usePassportStore((s) => s.sessions);
  const trips = usePassportStore((s) => s.trips);
  const shareLinks = usePassportStore((s) => s.shareLinks);
  const connections = usePassportStore((s) => s.connections);
  const reviews = usePassportStore((s) => s.locationReviews);
  const verification = usePassportStore((s) => s.verification);
  const badges = usePassportStore((s) => s.badges);
  const reputation = usePassportStore((s) => s.reputation);
  const auditLogs = usePassportStore((s) => s.auditLogs);
  const consentLogs = usePassportStore((s) => s.consentLogs);
  const roles = usePassportStore((s) => s.roles);
  const dataExport = usePassportStore((s) => s.dataExport);
  const voucherWallet = usePassportStore((s) => s.voucherWallet);
  const updateAccount = usePassportStore((s) => s.updateAccount);
  const updateProfileSettings = usePassportStore((s) => s.updateProfileSettings);
  const logoutOtherSessions = usePassportStore((s) => s.logoutOtherSessions);
  const createShareLink = usePassportStore((s) => s.createShareLink);
  const requestDataExport = usePassportStore((s) => s.requestDataExport);
  const requestAccountDeletion = usePassportStore((s) => s.requestAccountDeletion);

  const [formDraft, setFormDraft] = useState<ProfileForm | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewPublic, setPreviewPublic] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const form = formDraft ?? (account ? createProfileForm(account) : null);

  const points = useMemo(
    () => stamps.reduce((sum, stamp) => sum + stamp.points, 0),
    [stamps],
  );

  const validation = useMemo(() => validateProfile(form), [form]);
  const primaryEmailVerified =
    account?.emails.find((email) => email.isPrimary)?.isVerified ?? false;

  if (!passport || !account || !profileSettings || !form) {
    return (
      <div className="min-h-[100dvh] bg-canvas">
        <TopBar title={locale === "vi" ? "Ho chieu" : "Profile"} />
        <div className="px-5 pt-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment">
            <UserRound className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-display-md">
            {locale === "vi" ? "Can kich hoat ho chieu" : "Activate your passport"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-body text-ink-soft">
            {locale === "vi"
              ? "Ho so ca nhan se duoc tao sau khi kich hoat ho chieu so."
              : "Your account profile is created after digital passport activation."}
          </p>
          <Button asChild className="mt-6 rounded-full px-6">
            <Link href="/activate">{locale === "vi" ? "Kich hoat" : "Activate"}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fieldVisibility = profileSettings.fieldVisibility;

  function setProfileField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setFormDraft((current) => {
      const base = current ?? (account ? createProfileForm(account) : null);
      return base ? { ...base, [key]: value } : base;
    });
    setSaveNote("");
  }

  function setSettings(next: ProfileSettings) {
    updateProfileSettings(next);
    setSaveNote(locale === "vi" ? "Da cap nhat cai dat." : "Settings updated.");
  }

  function updateVisibility(field: string, value: FieldVisibility) {
    if (!profileSettings) return;
    setSettings({
      ...profileSettings,
      fieldVisibility: {
        ...profileSettings.fieldVisibility,
        [field]: value,
      },
    });
  }

  function handleAvatarUpload(file: File | undefined) {
    if (!file) return;
    setProfileField("profilePhotoUrl", URL.createObjectURL(file));
  }

  function saveProfile() {
    if (!account || !form) return;
    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const updated: Account = {
      ...account,
      user: {
        ...account.user,
        displayName: form.displayName.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim().toLowerCase(),
        profilePhotoUrl: form.profilePhotoUrl || undefined,
        preferredLanguage: form.preferredLanguage,
        timezone: form.timezone.trim(),
        locale: form.locale,
      },
      emails: [
        {
          address: form.primaryEmail.trim().toLowerCase(),
          isPrimary: true,
          isVerified: primaryEmailVerified,
          verifiedAt: account.emails.find((email) => email.isPrimary)?.verifiedAt,
        },
        ...(form.secondaryEmail.trim()
          ? [
              {
                address: form.secondaryEmail.trim().toLowerCase(),
                isPrimary: false,
                isVerified:
                  account.emails.find((email) => email.address === form.secondaryEmail)?.isVerified ??
                  false,
              },
            ]
          : []),
      ],
      isProfilePublic: account.isProfilePublic,
    };
    updateAccount(updated);
    setSaveNote(locale === "vi" ? "Da luu ho so." : "Profile saved.");
  }

  const publicFields = [
    ["Bio", account.user.bio || "Collecting stamps across Da Nang."],
    ["Passport", `${passport.code} - ${passport.country || "VN"}`],
    ["Stamps", `${stamps.length} collected - ${points} points`],
    ["Badges", badges.map((badge) => badge.label).join(", ") || "None"],
  ].filter(([key]) => isVisible(key.toLowerCase(), fieldVisibility, previewPublic));

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <TopBar
        title={locale === "vi" ? "Ho so" : "Profile"}
        right={
          <Link href="/app/settings" className="flex h-10 w-10 items-center justify-center">
            <Shield className="h-5 w-5" />
          </Link>
        }
      />

      <main className="px-4 pt-4">
        <section className="rounded-[28px] bg-parchment p-5">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={locale === "vi" ? "Tai anh dai dien" : "Upload avatar"}
            >
              <Avatar className="h-20 w-20 border border-hairline bg-canvas">
                <AvatarImage
                  src={form.profilePhotoUrl}
                  alt=""
                  style={{ objectFit: "cover", objectPosition: `50% ${form.cropY}%` }}
                />
                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                  {initials(form.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-parchment">
                <Camera className="h-4 w-4" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-display-md">{form.displayName || account.user.displayName}</h2>
                {account.user.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-fine font-semibold text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {locale === "vi" ? "Da xac minh" : "Verified"}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-caption text-ink-soft">@{form.username}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <ProfileStat label={locale === "vi" ? "Diem" : "Points"} value={points} />
                <ProfileStat label={locale === "vi" ? "Dau" : "Stamps"} value={stamps.length} />
                <ProfileStat
                  label={locale === "vi" ? "Ket noi" : "Connections"}
                  value={connections.length}
                />
              </div>
            </div>
          </div>

          {form.profilePhotoUrl ? (
            <label className="mt-4 block text-caption text-ink-soft">
              {locale === "vi" ? "Can khung anh" : "Avatar crop"}
              <input
                type="range"
                min="0"
                max="100"
                value={form.cropY}
                onChange={(event) => setProfileField("cropY", Number(event.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </label>
          ) : null}
        </section>

        <Tabs defaultValue="identity" className="mt-5">
          <TabsList className="grid h-auto w-full grid-cols-4 rounded-full bg-parchment p-1">
            <TabsTrigger value="identity" className="rounded-full text-fine">
              {locale === "vi" ? "Ca nhan" : "Identity"}
            </TabsTrigger>
            <TabsTrigger value="travel" className="rounded-full text-fine">
              {locale === "vi" ? "Du lich" : "Travel"}
            </TabsTrigger>
            <TabsTrigger value="share" className="rounded-full text-fine">
              {locale === "vi" ? "Chia se" : "Share"}
            </TabsTrigger>
            <TabsTrigger value="trust" className="rounded-full text-fine">
              {locale === "vi" ? "Tin cay" : "Trust"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="mt-5 space-y-5">
            <Panel title={locale === "vi" ? "Danh tinh co ban" : "Basic Identity"} icon={<UserRound />}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Display name" error={errors.displayName || validation.displayName}>
                  <Input value={form.displayName} onChange={(e) => setProfileField("displayName", e.target.value)} />
                </Field>
                <Field label="Username" error={errors.username || validation.username}>
                  <Input value={form.username} onChange={(e) => setProfileField("username", e.target.value)} />
                </Field>
                <Field label="First name">
                  <Input value={form.firstName} onChange={(e) => setProfileField("firstName", e.target.value)} />
                </Field>
                <Field label="Last name">
                  <Input value={form.lastName} onChange={(e) => setProfileField("lastName", e.target.value)} />
                </Field>
                <Field label="Primary email" error={errors.primaryEmail || validation.primaryEmail}>
                  <Input value={form.primaryEmail} onChange={(e) => setProfileField("primaryEmail", e.target.value)} />
                  <span className="mt-1 block text-fine text-ink-soft">
                    {primaryEmailVerified ? "Verified primary email" : "Email verification pending"}
                  </span>
                </Field>
                <Field label="Secondary email">
                  <Input value={form.secondaryEmail} onChange={(e) => setProfileField("secondaryEmail", e.target.value)} />
                </Field>
                <Field label="Preferred language">
                  <Segmented
                    value={form.preferredLanguage}
                    options={[
                      ["vi", "VI"],
                      ["en", "EN"],
                    ]}
                    onChange={(value) => setProfileField("preferredLanguage", value as "vi" | "en")}
                  />
                </Field>
                <Field label="Locale">
                  <Segmented
                    value={form.locale}
                    options={[
                      ["vi", "Vietnam"],
                      ["en", "English"],
                    ]}
                    onChange={(value) => setProfileField("locale", value as "vi" | "en")}
                  />
                </Field>
                <Field label="Timezone">
                  <Input value={form.timezone} onChange={(e) => setProfileField("timezone", e.target.value)} />
                </Field>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button onClick={saveProfile} className="rounded-full px-6">
                  {locale === "vi" ? "Luu ho so" : "Save profile"}
                </Button>
                {saveNote ? <span className="text-caption text-primary">{saveNote}</span> : null}
              </div>
            </Panel>

            <Panel title={locale === "vi" ? "Bao mat & phien dang nhap" : "Security & Sessions"} icon={<Lock />}>
              <SettingRow
                icon={<Fingerprint className="h-4 w-4" />}
                label="Two-factor authentication"
                detail={account.twoFAMethod?.toUpperCase() || "TOTP"}
                control={<Switch checked={account.twoFAEnabled} onCheckedChange={(checked) => updateAccount({ ...account, twoFAEnabled: checked, twoFAMethod: checked ? "totp" : undefined })} />}
              />
              <SettingRow
                icon={<Shield className="h-4 w-4" />}
                label="Change password"
                detail={`Last changed ${formatDate(account.passwordChangedAt)}`}
                control={<ChevronRight className="h-4 w-4 text-ink-soft" />}
              />
              <div className="mt-3 divide-y divide-hairline overflow-hidden rounded-2xl bg-canvas">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-body">{session.deviceName}</div>
                      <div className="text-caption text-ink-soft">
                        {session.id === "sess_current" ? "Current device" : session.ipAddress} - {formatDate(session.lastActivityAt)}
                      </div>
                    </div>
                    <span className="text-fine text-ink-soft">{session.id === "sess_current" ? "Active" : "Web"}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-3 rounded-full" onClick={logoutOtherSessions}>
                {locale === "vi" ? "Dang xuat phien khac" : "Logout other sessions"}
              </Button>
            </Panel>

            <Panel title={locale === "vi" ? "Rieng tu & hien thi" : "Privacy & Visibility"} icon={<Eye />}>
              <SettingRow
                icon={<Globe className="h-4 w-4" />}
                label="Public profile"
                detail={account.isProfilePublic ? "Discoverable profile is on" : "Profile is private"}
                control={<Switch checked={account.isProfilePublic} onCheckedChange={(checked) => updateAccount({ ...account, isProfilePublic: checked })} />}
              />
              {["email", "bio", "passport", "stamps", "documents", "trips", "emergency"].map((field) => (
                <VisibilityRow
                  key={field}
                  field={field}
                  value={fieldVisibility[field] || "private"}
                  onChange={(value) => updateVisibility(field, value)}
                />
              ))}
              <button
                className="mt-3 inline-flex items-center gap-2 text-caption font-semibold text-primary"
                onClick={() => setPreviewPublic((value) => !value)}
              >
                <Eye className="h-4 w-4" />
                {previewPublic ? "Editing view" : "Preview as public"}
              </button>
              {previewPublic ? (
                <div className="mt-3 rounded-2xl bg-canvas p-4">
                  <div className="text-tagline">Public preview</div>
                  <div className="mt-2 space-y-2">
                    {publicFields.map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 text-caption">
                        <span className="text-ink-soft">{label}</span>
                        <span className="text-right text-ink">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </Panel>
          </TabsContent>

          <TabsContent value="travel" className="mt-5 space-y-5">
            <Panel title={locale === "vi" ? "Ho chieu & kich hoat" : "Passport & Activation"} icon={<FileLock2 />}>
              <InfoGrid
                items={[
                  ["Passport code", passport.code],
                  ["Owner", passport.ownerName || account.user.displayName],
                  ["Activated", passport.activatedAt ? formatDate(passport.activatedAt) : "Pending"],
                  ["Authority", passport.issuingAuthority || "DanangBooth Passport Desk"],
                  ["Country", passport.country || "VN"],
                  ["Status", passport.isActivated ? "Activated" : "Pending"],
                ]}
              />
            </Panel>

            <Panel title={locale === "vi" ? "Tai lieu du lich" : "Travel Documents"} icon={<FileLock2 />}>
              <div className="space-y-2">
                {documents.map((document) => (
                  <DataRow
                    key={document.id}
                    title={document.type.replaceAll("_", " ")}
                    detail={`${document.metadata.issuedBy || "Unknown issuer"} - ${document.metadata.expiresAt ? `expires ${formatDate(document.metadata.expiresAt)}` : "no expiry"}`}
                    meta={document.status}
                  />
                ))}
              </div>
              <p className="mt-3 text-caption text-ink-soft">
                Secure uploads use signed URLs; document files are modeled as encrypted storage references with review status.
              </p>
            </Panel>

            <Panel title={locale === "vi" ? "Lich su, ban do & an toan" : "History, Map & Safety"} icon={<Map />}>
              <InfoGrid
                items={[
                  ["Map style", profileSettings.mapStyle || "light"],
                  ["Last viewed", profileSettings.lastViewedLocationId || "None"],
                  ["Auto check-in radius", `${profileSettings.nearbyAutoCheckinRadiusMeters || 0}m`],
                  ["Trips", String(trips.length)],
                  ["Stamped visits", String(stamps.length)],
                  ["Public reviews", String(reviews.filter((review) => review.isPublic).length)],
                ]}
              />
              <div className="mt-3 grid gap-2">
                {emergencyContacts.map((contact) => (
                  <DataRow key={contact.id} title={contact.name} detail={`${contact.relation} - ${contact.phone}`} meta={contact.isPrimary ? "primary" : "backup"} />
                ))}
                {medicalAlerts.map((alert) => (
                  <DataRow key={alert.id} title={alert.title} detail={alert.description} meta={alert.severity} />
                ))}
                {embassyContacts.map((contact) => (
                  <DataRow key={contact.country} title={contact.name} detail={contact.phone} meta={contact.country} />
                ))}
              </div>
            </Panel>

            <Panel title={locale === "vi" ? "Voucher, thong bao & truy cap" : "Wallet, Notifications & Accessibility"} icon={<WalletCards />}>
              <InfoGrid
                items={[
                  ["Redeemed vouchers", String(voucherWallet.redeemedVoucherIds.length)],
                  ["Saved vouchers", String(voucherWallet.savedVoucherIds.length)],
                  ["Payment methods", String(voucherWallet.paymentMethods.length)],
                  ["Email", profileSettings.notificationsEmailEnabled ? "On" : "Off"],
                  ["Push", profileSettings.notificationsPushEnabled ? "On" : "Off"],
                  ["SMS", profileSettings.notificationsSmsEnabled ? "On" : "Off"],
                ]}
              />
              <div className="mt-3 grid gap-2">
                <SettingRow
                  icon={<Accessibility className="h-4 w-4" />}
                  label="High contrast"
                  detail="Accessibility preference"
                  control={<Switch checked={profileSettings.accessibilityHighContrast} onCheckedChange={(checked) => setSettings({ ...profileSettings, accessibilityHighContrast: checked })} />}
                />
                <label className="block rounded-2xl bg-canvas px-4 py-3 text-caption text-ink-soft">
                  Font scale {profileSettings.accessibilityFontScale.toFixed(1)}x
                  <input
                    type="range"
                    min="1"
                    max="1.4"
                    step="0.1"
                    value={profileSettings.accessibilityFontScale}
                    onChange={(event) => setSettings({ ...profileSettings, accessibilityFontScale: Number(event.target.value) })}
                    className="mt-2 w-full accent-primary"
                  />
                </label>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="share" className="mt-5 space-y-5">
            <Panel title={locale === "vi" ? "Lien ket chia se" : "Shareable Profile Views"} icon={<QrCode />}>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full" onClick={() => createShareLink(["bio", "stamps", "badges"])}>
                  Create public QR
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => createShareLink(["passport", "documents"])}>
                  Create private doc link
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {shareLinks.map((link) => (
                  <DataRow
                    key={link.id}
                    title={link.qrValue}
                    detail={`Scope: ${link.scope.join(", ")}`}
                    meta={`expires ${formatDate(link.expiresAt)}`}
                  />
                ))}
              </div>
            </Panel>

            <Panel title={locale === "vi" ? "Ket noi & hanh trinh" : "Connections & Journey Sharing"} icon={<Users />}>
              <InfoGrid
                items={[
                  ["Connections", String(connections.filter((c) => c.status === "connected").length)],
                  ["Following", String(connections.filter((c) => c.status === "following").length)],
                  ["Follow privacy", profileSettings.followPrivacy || "approval_required"],
                  ["Shared trips", String(trips.filter((trip) => trip.isShared).length)],
                ]}
              />
              <Link href="/app/journey/share" className="mt-3 inline-flex items-center gap-2 text-caption font-semibold text-primary">
                Open journey share editor <ChevronRight className="h-4 w-4" />
              </Link>
            </Panel>

            <Panel title={locale === "vi" ? "Danh gia & meo" : "Reviews & Tips"} icon={<Star />}>
              <div className="space-y-2">
                {reviews.map((review) => (
                  <DataRow key={review.id} title={`Location ${review.locationId}`} detail={review.note} meta={`${review.rating}/5 - ${review.isPublic ? "public" : "private"}`} />
                ))}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="trust" className="mt-5 space-y-5">
            <Panel title={locale === "vi" ? "Xac minh & huy hieu" : "Verification & Badges"} icon={<CheckCircle2 />}>
              <InfoGrid
                items={[
                  ["Identity", verification.identityStatus],
                  ["Documents", verification.documentStatus],
                  ["OCR owner", verification.ocrMetadata?.ownerName || "Not extracted"],
                  ["Review notes", verification.manualReviewNotes || "None"],
                  ["Reputation", `${reputation.rating}/5`],
                  ["Contributions", String(reputation.contributionCount)],
                ]}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge.id} className="rounded-full bg-canvas px-3 py-1.5 text-caption font-semibold text-primary">
                    {badge.label}
                  </span>
                ))}
              </div>
            </Panel>

            <Panel title={locale === "vi" ? "Quan tri, bao cao & tuan thu" : "Admin, Moderation & Compliance"} icon={<Shield />}>
              <InfoGrid
                items={[
                  ["Role", roles[0]?.role || "user"],
                  ["Blocked users", "0"],
                  ["Audit logs", String(auditLogs.length)],
                  ["Consent logs", String(consentLogs.length)],
                  ["JSON export", dataExport.jsonReady ? "Ready" : "Not ready"],
                  ["vCard export", dataExport.vcardReady ? "Ready" : "Not ready"],
                ]}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" onClick={requestDataExport}>
                  <Download className="h-4 w-4" />
                  Request export
                </Button>
                <Button variant="outline" className="rounded-full text-destructive" onClick={requestAccountDeletion}>
                  Request deletion
                </Button>
              </div>
              <p className="mt-3 text-caption text-ink-soft">
                Field visibility is modeled for API enforcement; document records reference encrypted storage and signed upload/download URLs.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function validateProfile(form: ProfileForm | null): Record<string, string> {
  if (!form) return {};
  const next: Record<string, string> = {};
  if (form.displayName.trim().length < 2) next.displayName = "Use at least 2 characters.";
  if (!/^[a-z0-9._]{3,24}$/.test(form.username.trim().toLowerCase())) {
    next.username = "3-24 lowercase letters, numbers, dots, or underscores.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.primaryEmail.trim())) {
    next.primaryEmail = "Enter a valid email.";
  }
  return next;
}

function createProfileForm(account: Account): ProfileForm {
  const primaryEmail = account.emails.find((email) => email.isPrimary);
  const secondaryEmail = account.emails.find((email) => !email.isPrimary);
  return {
    displayName: account.user.displayName,
    firstName: account.user.firstName,
    lastName: account.user.lastName,
    username: account.user.username,
    primaryEmail: primaryEmail?.address || "",
    secondaryEmail: secondaryEmail?.address || "",
    profilePhotoUrl: account.user.profilePhotoUrl || "",
    preferredLanguage: account.user.preferredLanguage,
    timezone: account.user.timezone,
    locale: account.user.locale,
    cropY: 50,
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isVisible(field: string, visibility: Record<string, FieldVisibility>, previewPublic: boolean) {
  if (!previewPublic) return true;
  const normalized = field === "badges" ? "bio" : field;
  return visibility[normalized] === "public";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-canvas px-3 py-2">
      <div className="text-tagline">{value}</div>
      <div className="text-fine text-ink-soft">{label}</div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactElement; children: ReactNode }) {
  return (
    <section className="rounded-[28px] bg-parchment p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-primary">
          {icon}
        </span>
        <h3 className="text-tagline">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-caption text-ink-soft">
      {label}
      <div className="mt-1">{children}</div>
      {error ? <span className="mt-1 block text-fine text-destructive">{error}</span> : null}
    </label>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex rounded-full bg-canvas p-1">
      {options.map(([optionValue, label]) => (
        <button
          key={optionValue}
          type="button"
          onClick={() => onChange(optionValue)}
          className={
            "flex-1 rounded-full px-3 py-2 text-caption font-semibold transition-colors " +
            (value === optionValue ? "bg-primary text-primary-foreground" : "text-ink-soft")
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SettingRow({
  icon,
  label,
  detail,
  control,
}: {
  icon: ReactNode;
  label: string;
  detail: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-canvas px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-ink-soft">{icon}</span>
        <div className="min-w-0">
          <div className="text-body">{label}</div>
          <div className="truncate text-caption text-ink-soft">{detail}</div>
        </div>
      </div>
      {control}
    </div>
  );
}

function VisibilityRow({
  field,
  value,
  onChange,
}: {
  field: string;
  value: FieldVisibility;
  onChange: (value: FieldVisibility) => void;
}) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
      <span className="text-body capitalize">{field}</span>
      <div className="flex rounded-full bg-parchment p-1">
        {visibilityOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={
              "rounded-full px-3 py-1.5 text-fine font-semibold capitalize " +
              (value === option ? "bg-primary text-primary-foreground" : "text-ink-soft")
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-canvas px-4 py-3">
          <div className="text-fine uppercase tracking-widest text-ink-soft">{label}</div>
          <div className="mt-1 truncate text-body">{value}</div>
        </div>
      ))}
    </div>
  );
}

function DataRow({ title, detail, meta }: { title: string; detail: string; meta: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-canvas px-4 py-3">
      <div className="min-w-0">
        <div className="truncate text-body capitalize">{title}</div>
        <div className="truncate text-caption text-ink-soft">{detail}</div>
      </div>
      <span className="shrink-0 rounded-full bg-parchment px-2.5 py-1 text-fine font-semibold text-ink-soft">
        {meta}
      </span>
    </div>
  );
}
