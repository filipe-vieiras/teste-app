import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import CanvasSection from './CanvasSection';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialSections = {
  key_partners: { 
    title: 'Key Partners',
    subtitle: 'Who are our Key Partners?\nWho are our key suppliers?\nWhich Key Resources are we acquiring from partners?\nWhich Key Activities do partners perform?',
    items: [] 
  },
  key_activities: { 
    title: 'Key Activities',
    subtitle: 'What Key Activities do our Value Propositions require?\nOur Distribution Channels?\nCustomer Relationships?\nRevenue streams?',
    items: [] 
  },
  key_resources: { 
    title: 'Key Resources',
    subtitle: 'What Key Resources do our Value Propositions require?\nOur Distribution Channels?\nCustomer Relationships?\nRevenue Streams?',
    items: [] 
  },
  value_propositions: { 
    title: 'Value Propositions',
    subtitle: 'What value do we deliver to the customer?\nWhich one of our customer\'s problems are we helping to solve?\nWhat bundles of products and services are we offering to each Customer Segment?\nWhich customer needs are we satisfying?',
    items: [] 
  },
  customer_relationships: { 
    title: 'Customer Relationships',
    subtitle: 'What type of relationship does each of our Customer Segments expect us to establish?\nWhich ones have we established?\nHow are they integrated with the rest of our business model?\nHow costly are they?',
    items: [] 
  },
  channels: { 
    title: 'Channels',
    subtitle: 'Through which Channels do our Customer Segments want to be reached?\nHow are we reaching them now?\nHow are our Channels integrated?\nWhich ones work best?\nWhich ones are most cost-efficient?\nHow are we integrating them with customer routines?',
    items: [] 
  },
  customer_segments: { 
    title: 'Customer Segments',
    subtitle: 'For whom are we creating value?\nWho are our most important customers?',
    items: [] 
  },
  cost_structure: { 
    title: 'Cost Structure',
    subtitle: 'What are the most important costs inherent in our business model?\nWhich Key Resources are most expensive?\nWhich Key Activities are most expensive?',
    items: [] 
  },
  revenue_streams: { 
    title: 'Revenue Streams',
    subtitle: 'For what value are our customers really willing to pay?\nFor what do they currently pay?\nHow are they currently paying?\nHow would they prefer to pay?\nHow much does each Revenue Stream contribute to overall revenues?',
    items: [] 
  }
};

export default function BusinessCanvas() {
  const [canvas, setCanvas] = useState(initialSections);
  const [title, setTitle] = useState('New Business Canvas');
  const [canvasId, setCanvasId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCanvas = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Auth error:', userError);
        toast.error('Please login to view your canvas');
        return;
      }

      console.log('Loading canvas for user:', user.id);

      const { data, error } = await supabase
        .from('business_canvas')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      console.log('Load response:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading canvas:', error);
        toast.error('Failed to load canvas');
        return;
      }

      if (data) {
        console.log('Setting canvas data:', data);
        setCanvasId(data.id);
        setTitle(data.title);
        setCanvas(data.data || initialSections);
      }
    } catch (error) {
      console.error('Error loading canvas:', error);
      toast.error('Failed to load canvas');
    }
  };

  useEffect(() => {
    loadCanvas();
    
    const channel = supabase
      .channel('business_canvas_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'business_canvas' }, 
        loadCanvas
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      if (window.saveTimeout) {
        clearTimeout(window.saveTimeout);
        handleSave();
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please login to save your canvas');
        return;
      }

      const payload = {
        title,
        data: canvas,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error } = canvasId 
        ? await supabase
            .from('business_canvas')
            .update(payload)
            .eq('id', canvasId)
            .eq('user_id', user.id)
        : await supabase
            .from('business_canvas')
            .insert([payload]);

      if (error) throw error;
      toast.success('Canvas saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save canvas');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSection = async (sectionKey, items) => {
    const updatedCanvas = {
      ...canvas,
      [sectionKey]: {
        ...canvas[sectionKey],
        title: canvas[sectionKey].title,
        subtitle: canvas[sectionKey].subtitle,
        items: items
      }
    };
    
    setCanvas(updatedCanvas);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
    
      const payload = {
        title,
        data: updatedCanvas,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
    
      const { error } = canvasId 
        ? await supabase
            .from('business_canvas')
            .update(payload)
            .eq('id', canvasId)
            .eq('user_id', user.id)
        : await supabase
            .from('business_canvas')
            .insert([payload]);
    
      if (error) throw error;
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update canvas');
    }
  };

  return (
    <div className="p-4 max-w-[2500px] mx-auto">
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          className="text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none"
          placeholder="Canvas Title"
        />
      </div>
    
      {/* Main grid container */}
      <div className="grid min-[1600px]:grid-cols-5 grid-cols-2 gap-4">
        {/* Key Partners */}
        <div className="min-[1600px]:h-[800px] h-[400px] min-[1600px]:col-span-1 col-span-2">
          <CanvasSection
            key="key_partners"
            sectionKey="key_partners"
            title={canvas.key_partners.title}
            subtitle={canvas.key_partners.subtitle}
            items={canvas.key_partners.items}
            onUpdate={(items) => updateSection('key_partners', items)}
          />
        </div>
    
        {/* Middle Sections */}
        <div className="min-[1600px]:col-span-3 col-span-2 grid min-[1600px]:grid-cols-3 grid-cols-1 gap-4">
          {/* First Column */}
          <div className="flex flex-col gap-4">
            <div className="min-[1600px]:h-[392px] h-[400px] w-full">
              <CanvasSection
                key="key_activities"
                sectionKey="key_activities"
                title={canvas.key_activities.title}
                subtitle={canvas.key_activities.subtitle}
                items={canvas.key_activities.items}
                onUpdate={(items) => updateSection('key_activities', items)}
              />
            </div>
            <div className="min-[1600px]:h-[392px] h-[400px] w-full">
              <CanvasSection
                key="key_resources"
                sectionKey="key_resources"
                title={canvas.key_resources.title}
                subtitle={canvas.key_resources.subtitle}
                items={canvas.key_resources.items}
                onUpdate={(items) => updateSection('key_resources', items)}
              />
            </div>
          </div>
    
          {/* Value Propositions */}
          <div className="min-[1600px]:h-[800px] h-[400px] w-full">
            <CanvasSection
              key="value_propositions"
              sectionKey="value_propositions"
              title={canvas.value_propositions.title}
              subtitle={canvas.value_propositions.subtitle}
              items={canvas.value_propositions.items}
              onUpdate={(items) => updateSection('value_propositions', items)}
            />
          </div>
    
          {/* Third Column */}
          <div className="flex flex-col gap-4">
            <div className="min-[1600px]:h-[392px] h-[400px] w-full">
              <CanvasSection
                key="customer_relationships"
                sectionKey="customer_relationships"
                title={canvas.customer_relationships.title}
                subtitle={canvas.customer_relationships.subtitle}
                items={canvas.customer_relationships.items}
                onUpdate={(items) => updateSection('customer_relationships', items)}
              />
            </div>
            <div className="min-[1600px]:h-[392px] h-[400px] w-full">
              <CanvasSection
                key="channels"
                sectionKey="channels"
                title={canvas.channels.title}
                subtitle={canvas.channels.subtitle}
                items={canvas.channels.items}
                onUpdate={(items) => updateSection('channels', items)}
              />
            </div>
          </div>
        </div>
    
        {/* Customer Segments */}
        <div className="min-[1600px]:h-[800px] h-[400px] min-[1600px]:col-span-1 col-span-2">
          <CanvasSection
            key="customer_segments"
            sectionKey="customer_segments"
            title={canvas.customer_segments.title}
            subtitle={canvas.customer_segments.subtitle}
            items={canvas.customer_segments.items}
            onUpdate={(items) => updateSection('customer_segments', items)}
          />
        </div>
    
        {/* Bottom Row */}
        <div className="min-[1600px]:col-span-5 col-span-2 grid grid-cols-2 gap-4 mt-4">
          <div className="h-[400px]">
            <CanvasSection
              key="cost_structure"
              sectionKey="cost_structure"
              title={canvas.cost_structure.title}
              subtitle={canvas.cost_structure.subtitle}
              items={canvas.cost_structure.items}
              onUpdate={(items) => updateSection('cost_structure', items)}
            />
          </div>
          <div className="h-[400px]">
            <CanvasSection
              key="revenue_streams"
              sectionKey="revenue_streams"
              title={canvas.revenue_streams.title}
              subtitle={canvas.revenue_streams.subtitle}
              items={canvas.revenue_streams.items}
              onUpdate={(items) => updateSection('revenue_streams', items)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}