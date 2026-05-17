"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Creator");

  // CREATOR FIELDS
  const [niche, setNiche] = useState("");
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [location, setLocation] = useState("");

  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const [rate, setRate] = useState("");
  const [packageDetails, setPackageDetails] = useState("");
  const [languages, setLanguages] = useState("");

  // BRAND FIELDS
  const [brandExpertise, setBrandExpertise] = useState("");
  const [website, setWebsite] = useState("");
  const [companyType, setCompanyType] = useState("");

  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setFullName(data.name || user.displayName || "");
          setEmail(data.email || user.email || "");
          setRole(data.role || "Creator");

          // CREATOR DATA
          setNiche(data.niche || "");
          setFollowers(data.followers || "");
          setEngagementRate(data.engagementRate || "");
          setLocation(data.location || "");

          setInstagram(data.instagram || "");
          setYoutube(data.youtube || "");

          setRate(data.rate || "");
          setPackageDetails(data.packageDetails || "");
          setLanguages(data.languages || "");

          // BRAND DATA
          setBrandExpertise(data.brandExpertise || "");
          setWebsite(data.website || "");
          setCompanyType(data.companyType || "");

          setBio(data.bio || "");
          setProfileImage(data.profileImage || "");
        } else {
          setFullName(user.displayName || "");
          setEmail(user.email || "");
        }
      } catch (error) {
        console.log("Error fetching profile:", error);

        setFullName(user.displayName || "");
        setEmail(user.email || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!auth.currentUser) return;

    try {
      setSaving(true);

      const user = auth.currentUser;

      await updateProfile(user, {
        displayName: fullName.trim(),
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: fullName.trim(),
          email: user.email || "",
          role,

          // CREATOR DATA
          niche,
          followers,
          engagementRate,
          location,

          instagram,
          youtube,

          rate,
          packageDetails,
          languages,

          // BRAND DATA
          brandExpertise,
          website,
          companyType,

          bio,
          profileImage,

          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success("Profile saved successfully.");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#312e81,_#0f172a_45%,_#000_100%)] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.12)]">

          <div className="mb-10">
            <p className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Creator & Brand Profile
            </p>

            <h1 className="text-4xl font-bold">
              Advanced Profile Settings
            </h1>

            <p className="mt-3 text-gray-300">
              Build your professional creator or brand profile.
            </p>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="grid gap-6 md:grid-cols-2"
          >

            {/* PROFILE IMAGE */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Profile Image URL
              </label>

              <input
                type="text"
                value={profileImage}
                onChange={(e) =>
                  setProfileImage(e.target.value)
                }
                placeholder="Paste image URL"
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />

              {profileImage && (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="mt-4 h-28 w-28 rounded-full object-cover"
                />
              )}
            </div>

            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-gray-400 outline-none"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Role
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              >
                <option className="bg-black">
                  Creator
                </option>

                <option className="bg-black">
                  Brand
                </option>
              </select>
            </div>

            {/* CREATOR FIELDS */}
            {role === "Creator" && (
              <>
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Niche
                  </label>

                  <input
                    type="text"
                    value={niche}
                    onChange={(e) =>
                      setNiche(e.target.value)
                    }
                    placeholder="Fashion, Fitness..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Followers
                  </label>

                  <input
                    type="text"
                    value={followers}
                    onChange={(e) =>
                      setFollowers(e.target.value)
                    }
                    placeholder="50K"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Engagement Rate
                  </label>

                  <input
                    type="text"
                    value={engagementRate}
                    onChange={(e) =>
                      setEngagementRate(e.target.value)
                    }
                    placeholder="8%"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Location
                  </label>

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="Mumbai"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Instagram
                  </label>

                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) =>
                      setInstagram(e.target.value)
                    }
                    placeholder="Instagram link"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    YouTube
                  </label>

                  <input
                    type="text"
                    value={youtube}
                    onChange={(e) =>
                      setYoutube(e.target.value)
                    }
                    placeholder="YouTube link"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Creator Rate
                  </label>

                  <input
                    type="text"
                    value={rate}
                    onChange={(e) =>
                      setRate(e.target.value)
                    }
                    placeholder="₹10,000 per reel"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Languages
                  </label>

                  <input
                    type="text"
                    value={languages}
                    onChange={(e) =>
                      setLanguages(e.target.value)
                    }
                    placeholder="English, Hindi"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Package Details
                  </label>

                  <textarea
                    value={packageDetails}
                    onChange={(e) =>
                      setPackageDetails(e.target.value)
                    }
                    rows={4}
                    placeholder="1 Reel + 2 Stories..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>
              </>
            )}

            {/* BRAND FIELDS */}
            {role === "Brand" && (
              <>
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Brand Expertise
                  </label>

                  <input
                    type="text"
                    value={brandExpertise}
                    onChange={(e) =>
                      setBrandExpertise(e.target.value)
                    }
                    placeholder="Skincare, Tech..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Company Type
                  </label>

                  <input
                    type="text"
                    value={companyType}
                    onChange={(e) =>
                      setCompanyType(e.target.value)
                    }
                    placeholder="Startup, Agency..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-gray-300">
                    Website
                  </label>

                  <input
                    type="text"
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                    placeholder="https://yourbrand.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                  />
                </div>
              </>
            )}

            {/* BIO */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                rows={5}
                placeholder="Write something about yourself..."
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              />
            </div>

            {/* BUTTON */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {saving
                  ? "Saving Profile..."
                  : "Save Profile"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}