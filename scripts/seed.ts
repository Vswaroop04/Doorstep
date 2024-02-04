import {
  insertNewUser,
  insertNewProvider,
  scheduleMeetingWithProvider,
  approveMeetingWithCustomer,
  scheduleOfflineMeetingWithProvider,
  getProviders,
  getProvider,
  getUser,
  userFeedback,
} from "@/lib/routes"; 

async function testFunctions() {
  try {
    const user = {
      name: "Test User",
      email: "testuser2@example.com",
      password: "testpassword",
      lat: 0.0,
      long: 0.0,
      mobile: 1234567890,
    };
    const createdUser = await insertNewUser(user);
    console.log("User created:", createdUser);

    // Create a provider
    const provider = {
      name: "Test Provider",
      email: "testprovider1@example.com",
      password: "testpassword",
      lat: 0.0,
      long: 0.0,
      offlineDuration: 1.5,
      mobile: 9876543210,
    };
    const createdProvider = await insertNewProvider(provider);
    console.log("Provider created:", createdProvider);

    // Get a list of providers (pagination example)
    const page = 1;
    const providersList = await getProviders(page);
    console.log("Providers list:", providersList);

    const providerEmail = "testprovider1@example.com";
    const providerPassword = "testpassword";
    const providerInfo = await getProvider(providerEmail, providerPassword);
    console.log("Provider information:", providerInfo);

    const slotId = providerInfo.provider?.slots[0]?.id;
    const userId = createdUser[0].id;
    if (slotId) {
      const meeting = await scheduleMeetingWithProvider(slotId, userId);
      console.log("Meeting scheduled:", meeting);
      if ("message" in meeting) {
        console.log("Message:", meeting.message);
      } else {
        const approvedMeeting = await approveMeetingWithCustomer(
          meeting[0]?.id,
          slotId
        );
        console.log("Meeting approved:", approvedMeeting);
      }
    }
    const offlineMeeting = {
      userId: createdUser[0].id,
      date: "2024-02-03",
      providerId: createdProvider[0].id,
      offlineSlotTime: "15:00:00",
      offlineSlotDuration: 2.5,
      priority: 1,
    };
    const offlineMeetingResult = await scheduleOfflineMeetingWithProvider(
      offlineMeeting
    );
    console.log("Offline meeting scheduled:", offlineMeetingResult);
    const feedback = {
      userId: createdUser[0].id,
      providerId: createdProvider[0].id,
      punctuality: 5,
      professionalism: 4,
      problemResolution: 5,
      efficiency: 4,
      cleanliness: 5,
      responseTime: 4,
      resolutionTime: 5,
    };
    const feedbackResult = await userFeedback(feedback);
    console.log("User feedback submitted:", feedbackResult);

    const providerInfo2 = await getProvider(providerEmail, providerPassword);
    console.log("Provider information after some events:", providerInfo2);

    const userInfo = await getUser(user.email, user.password)
    console.log("userInfo" + userInfo)
  } catch (error) {
    console.error("Error:", error);
  }
}

testFunctions();
